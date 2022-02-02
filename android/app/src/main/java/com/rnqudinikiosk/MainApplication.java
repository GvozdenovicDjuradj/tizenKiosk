package com.rnqudinikiosk;

import android.app.Application;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.facebook.react.ReactApplication;
import io.sentry.RNSentryPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.wheelpicker.WheelPicker;

import net.infoxication.reactstarprnt.RNStarPrntPackage;

import java.util.Arrays;
import java.util.List;

import codes.simen.IMEI.IMEI;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;

public final class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost reactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new MainReactPackage(),
            new RNSentryPackage(),
            new KCKeepAwakePackage(),
                    new IMEI(),
                    new RNGestureHandlerPackage(),
                    new RNFetchBlobPackage(),
                    new WheelPicker(),
                    new RNViewShotPackage(),
                    new RNStarPrntPackage(),
                    new RNDeviceInfo(),
                    new NipponPrinterPackage(),
                    new ReactVideoPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return reactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
