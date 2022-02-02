package com.rnqudinikiosk;

import android.content.ContentResolver;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.annotation.Nonnull;

import npi.sdk.NPrinterLib;
import npi.sdk.common.NRet;
import npi.sdk.data.NInt;
import npi.sdk.data.NString;

import static npi.sdk.common.NRet.SUCCESS;

/**
 * This module offers the capability of bridging the Nippon Primex NP-2511D-2
 * into a React Native environment, currently there is no iOS implementation
 * due to this not being required from the business. If an iOS implementation
 * is needed it may make sense to extract this out into a reusable native
 * module which is published on npm.
 * <p>
 * I would highly suggest that you read through the SDK documentation found here:
 * https://www.primex.co.jp/NPIServlet?viewpage=4098&nextpage=4099&BLGCode=9&ModelCode=59
 * Before making changes to this module.
 * <p>
 * The SDK is quite low level and I have abstracted up the methods exposed to React
 * allowing us to print from a URI string and fetch the list of printers which are
 * available.
 */
public final class NipponPrinterModule extends ReactContextBaseJavaModule {
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_FAILED_TO_FIND_PRINTER = "E_FAILED_TO_FIND_PRINTER";
    private static final String NIPPON_SETTINGS_DIRECTORY = "/npi/";
    private static final String NIPPON_SERIAL_PATTERN = "1051";

    private static final int THREAD_SLEEP_TIME_MILLISECONDS = 30;
    private static final int MAX_OPEN_RETRY_LIMIT = 20;

    private static final byte PRINT_CUT_COMMAND = 0x1B;
    private static final byte PRINT_PARTIAL_CUT_COMMAND = 0x6D;
    private static final byte BIT_IMAGE_FORMAT_LINE_UNIT = 0x10;

    /**
     * The amount of dots in the two inch paper variant.
     */
    private static final int PAPER_TWO_INCH_DOTS = 416;

    private static final int EXECUTOR_THREAD_POOL_SIZE = 1;
    private static final ExecutorService findPrinterPool = Executors.newFixedThreadPool(EXECUTOR_THREAD_POOL_SIZE);
    private static final ExecutorService printImagePool = Executors.newFixedThreadPool(EXECUTOR_THREAD_POOL_SIZE);

    private final NPrinterLib nipponPrinterLibrary;
    private final ReactApplicationContext reactContext;

    private boolean hasCreatedDirectory = false;

    public NipponPrinterModule(ReactApplicationContext reactContext, NPrinterLib nPrinterLib) {
        super(reactContext);
        this.reactContext = reactContext;
        nipponPrinterLibrary = nPrinterLib;
    }

    @Nonnull
    @Override
    public String getName() {
        return "NipponPrinter";
    }

    private String getSettingsFileDirectory() {
        return Environment.getExternalStorageDirectory() + NIPPON_SETTINGS_DIRECTORY;
    }

    private void createSettingsFileDirectory() {
        if(getHasCreatedDirectory()) {
            return;
        }

        String filePath = getSettingsFileDirectory();
        File directory = new File(filePath);

        String[] files;
        files = directory.list();

        if (files != null) {
            for (String fileName : files) {
                File file = new File(directory, fileName);
                file.delete();
            }
        }

        directory.delete();
        directory.mkdir();
        setHasCreatedDirectory(true);
    }

    /**
     * This method allows you to obtain a list of printers which are available. Technically
     * more than one printer can be connected at any time however this method will only return
     * the first printer it establishes a connection with.
     *
     * @param promise The React Native promise object used to yield back to the
     *                JavaScript context.
     */
    @ReactMethod
    public void findPrinter(Promise promise) {
        findPrinterPool.execute(() -> {
            findPrinterSync(promise);
        });
    }

    void findPrinterSync(Promise promise) {
        createSettingsFileDirectory();

        try {
            List<String> printers = getPrinters();

            for (String printer : printers) {
                nipponPrinterLibrary.NOpenPrinter(printer);
            }

            while (true) {
                List<String> printersToRemove = new ArrayList<>();

                if (printers.isEmpty()) {
                    promise.resolve(new WritableNativeArray());
                    nipponPrinterLibrary.NClosePrinters();
                    return;
                }

                for (String printer : printers) {
                    int result = nipponPrinterLibrary.NOpenResult(printer);

                    if (result == NRet.ERR_STATUSTIMEOUT) {
                        nipponPrinterLibrary.NOpenPrinter(printer);
                        continue;
                    }

                    if (result < NRet.OPEN_BEFORE || result == NRet.USBAUTHORITY_NG) {
                        printersToRemove.add(printer);
                    }

                    if (result == SUCCESS || result == NRet.WRN_PRTALREADYOPEN) {
                        /*
                            Using a WritableNativeMap here allows us to resolve a
                            type adhering to the defined Printer type within TypeScript.

                            It's not possible to programmatically discover the macAddress
                            or USBSerialNumber.
                         */
                        WritableNativeMap writableNativeMap = new WritableNativeMap();
                        writableNativeMap.putString("modelName", "Nippon");
                        writableNativeMap.putString("macAddress", "");
                        writableNativeMap.putString("portName", printer);
                        writableNativeMap.putString("USBSerialNumber", "");
                        WritableNativeArray writableNativeArray = new WritableNativeArray();
                        writableNativeArray.pushMap(writableNativeMap);
                        promise.resolve(writableNativeArray);
                        nipponPrinterLibrary.NResetPrinter(printer);
                        return;
                    }
                }

                for (String printer : printersToRemove) {
                    printers.remove(printer);
                }

                /*
                    This will ensure we don't get into a spin-lock state which could drain
                    the devices resources.
                 */
                Thread.sleep(THREAD_SLEEP_TIME_MILLISECONDS);
            }
        } catch (Throwable t) {
            promise.reject(E_FAILED_TO_FIND_PRINTER, t.getMessage());
        }
    }

    @ReactMethod
    public void printImage(String printerName, String path, Promise promise) {
        printImagePool.execute(() -> {
            Context context = getCurrentActivity();

            if (context == null) {
                promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity does not exist");
                return;
            }

            try {
                ContentResolver contentResolver = context.getContentResolver();
                Uri imageUri = Uri.parse(path);
                Bitmap b = createScaledBitmapFromURI(contentResolver, imageUri);

                boolean openResult = openPrinter(printerName);

                if (!openResult) {
                    promise.reject("Failed to reconnect", "Could not reconnect to the selected printer...");
                    return;
                }

                nipponPrinterLibrary.NSetSendRetry(0);
                int result = nipponPrinterLibrary.NImagePrint(printerName, b, b.getWidth(), b.getHeight(), BIT_IMAGE_FORMAT_LINE_UNIT, null);
                sendCutPaperCommand(printerName);

                if (result != SUCCESS) {
                    promise.reject(Integer.toString(result), "Could not communicate with the printer");
                    return;
                }

                promise.resolve(result);
            } catch (Throwable t) {
                promise.reject("Failed to print the provided Uri.", t);
            }
        });
    }

    @ReactMethod
    public void getPrinterStatus(String printerName, Promise promise) {
        printImagePool.execute(() -> {
            NInt o_status = new NInt();
            int nmsRet = nipponPrinterLibrary.NGetStatus(printerName, o_status);

            if (nmsRet != SUCCESS) {
                promise.resolve(NipponPrinterStatus.SUCCESS.getValue());
                return;
            }

            for (int i = 0; i < 8; ++i) {
                int nmsCheckBit = (int) Math.pow(2, i);
                if ((o_status.getValue() & nmsCheckBit) == nmsCheckBit) {
                    switch (i) {
                        case 0:
                            promise.resolve(NipponPrinterStatus.PAPER_LOW.getValue());
                            return;

                        case 2:
                            promise.resolve(NipponPrinterStatus.PAPER_EMPTY.getValue());
                            return;

                        default:
                            promise.resolve(NipponPrinterStatus.COULD_NOT_PRINT.getValue());
                            return;
                    }
                }
            }

            promise.resolve(NipponPrinterStatus.SUCCESS.getValue());
        });
    }

    private Bitmap createScaledBitmapFromURI(ContentResolver contentResolver, Uri uri) throws IOException {
        Bitmap bitmap = MediaStore.Images.Media.getBitmap(contentResolver, uri);
        int originalHeight = bitmap.getHeight(),
                originalWidth = bitmap.getWidth(),
                targetWidth = PAPER_TWO_INCH_DOTS,
                targetHeight = originalHeight / (originalWidth / targetWidth);

        return Bitmap.createScaledBitmap(bitmap, targetWidth, targetHeight, false);
    }

    /**
     * This method is used to send a partial cut command
     * to the printer. The SDK supplies a function called
     * NDPrint which effectively prints data encoded in
     * binary format in the structure of bytes. The printer
     * maps the value of these bytes to commands.
     * <p>
     * The 0th element within the byte array contains
     * the value of 0x1B I can't find any documentation
     * around this value however it's used within all
     * of the examples within the SDK example.
     * <p>
     * The 1st element within the byte array can either
     * be 0x69 which maps to the printer issuing a full
     * cut command or of value 0x6D which is a partial
     * cut.
     *
     * @param printerName This is the name of the printer
     *                    we want to send the command to.
     */
    private void sendCutPaperCommand(String printerName) {
        byte[] data = new byte[2];
        data[0] = PRINT_CUT_COMMAND;
        data[1] = PRINT_PARTIAL_CUT_COMMAND;
        nipponPrinterLibrary.NDPrint(printerName, data, data.length, null);
    }

    /**
     * This method is used to get the list of printers
     * from the Nippon settings file. This is however
     * not a list of printers which we can connect to
     * it's just the list of names.
     * <p>
     * The file contains the names in CSV format hence
     * I'm splitting on a comma.
     *
     * @return The list of possible printer names.
     */
    private List<String> getPrinters() {
        NString printersCSV = new NString();
        nipponPrinterLibrary.NEnumPrinters(printersCSV, null);
        String[] printers = printersCSV.getValue().trim().split(",");
        List<String> validPrinters = new ArrayList<>();
        for (String printer : printers) {
            if (!printer.equals("") && isNipponPrinter(printer)) {
                validPrinters.add(printer);
            }
        }
        return validPrinters;
    }

    /**
     * This method is used to determine if the connected
     * device picked up by the SDK is actually a Nippon
     * printer, I've encountered cases where it would
     * actually identify a Star printer as a Nippon
     * printer so performing a check on the serial
     * value returned by NGetPrinterInf gives us
     * confidence that we can use this.
     *
     * @return A boolean indicating if it is a Nippon printer.
     */
    private boolean isNipponPrinter(String name) {
        NString printerInfoString = new NString();
        int nmsRet = nipponPrinterLibrary.NGetPrinterInf(name, printerInfoString, new NInt());

        if (nmsRet != SUCCESS) {
            return false;
        }

        String[] serialValues = printerInfoString.splitComma();
        return (serialValues.length >= 2 && serialValues[1].startsWith(NIPPON_SERIAL_PATTERN));
    }

    public boolean getHasCreatedDirectory() {
        return hasCreatedDirectory;
    }

    public void setHasCreatedDirectory(boolean hasCreatedDirectory) {
        this.hasCreatedDirectory = hasCreatedDirectory;
    }

    boolean openPrinter(String name) {
        nipponPrinterLibrary.NOpenPrinter(name);
        int openResult;
        int i = 0;

        do {
            i++;

            openResult = nipponPrinterLibrary.NOpenResult(name);

            if (openResult == NRet.WRN_PRTALREADYOPEN) {
                return true;
            }

            if (openResult == SUCCESS) {
                nipponPrinterLibrary.NResetPrinter(name);
                return true;
            }

            if (openResult == NRet.ERR_STATUSTIMEOUT) {
                nipponPrinterLibrary.NOpenPrinter(name);
                openResult = NRet.OPEN_BEFORE;
                continue;
            }

            try {
                Thread.sleep(THREAD_SLEEP_TIME_MILLISECONDS);
            } catch (InterruptedException e) {
                return false;
            }
        }  while(openResult == NRet.OPEN_BEFORE && i < MAX_OPEN_RETRY_LIMIT);

        nipponPrinterLibrary.NClosePrinter(name);
        return false;
    }
}
