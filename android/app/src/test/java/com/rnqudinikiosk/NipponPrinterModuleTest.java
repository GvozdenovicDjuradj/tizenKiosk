package com.rnqudinikiosk;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

import org.junit.jupiter.api.Test;

import npi.sdk.NPrinterLib;
import npi.sdk.common.NRet;
import npi.sdk.data.NInt;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NipponPrinterModuleTest {
    @Test
    void findPrinterSyncShouldNotThrowANullPointerException() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        Promise mockedPromise = mock(Promise.class);

        // When
        nipponPrinterModule.findPrinterSync(mockedPromise);

        // Then
        verify(mockedPromise).reject("E_FAILED_TO_FIND_PRINTER", "no reactnativejni in java.library.path");
    }

    @Test
    void openPrinterShouldReturnTrueWhenThePortIsAlreadyOpen() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        String printer = "PRT001";

        // When
        when(mockedNPrinterLib.NOpenResult(printer)).thenReturn(NRet.WRN_PRTALREADYOPEN);
        boolean result = nipponPrinterModule.openPrinter(printer);

        // Then
        assertTrue(result);
        verify(mockedNPrinterLib).NOpenResult(printer);
    }

    @Test
    void openPrinterShouldReturnTrueWhenTheNOpenResultIsSuccess() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        String printer = "PRT001";

        // When
        when(mockedNPrinterLib.NOpenResult(printer)).thenReturn(NRet.SUCCESS);
        boolean result = nipponPrinterModule.openPrinter(printer);

        // Then
        assertTrue(result);
        verify(mockedNPrinterLib).NOpenResult(printer);
        verify(mockedNPrinterLib, times(1)).NResetPrinter(printer);
    }

    @Test
    void openPrinterShouldReturnFalseWhenTheNOpenResultIsLowerThanSuccess() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        String printer = "PRT001";

        // When
        when(mockedNPrinterLib.NOpenResult(printer)).thenReturn(NRet.ERR_PRTCLOSE);
        boolean result = nipponPrinterModule.openPrinter(printer);

        // Then
        assertFalse(result);
        verify(mockedNPrinterLib).NOpenResult(printer);
    }

    @Test
    void openPrinterShouldReturnTrueAfterARetryWhenNOpenResultReturnsERR_STATUSTIMEOUT() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        String printer = "PRT001";

        // When
        when(mockedNPrinterLib.NOpenResult(printer))
                .thenReturn(NRet.ERR_STATUSTIMEOUT)
                .thenReturn(NRet.SUCCESS);
        boolean result = nipponPrinterModule.openPrinter(printer);

        // Then
        assertTrue(result);
        verify(mockedNPrinterLib, times(2)).NOpenResult(printer);
        verify(mockedNPrinterLib, times(2)).NOpenPrinter(printer);
    }

    @Test
    void openPrinterShouldRetryWhenOPEN_BEFOREIsReturnedFromNOpenResult() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        String printer = "PRT001";

        // When
        when(mockedNPrinterLib.NOpenResult(printer))
                .thenReturn(NRet.OPEN_BEFORE)
                .thenReturn(NRet.SUCCESS);
        boolean result = nipponPrinterModule.openPrinter(printer);

        // Then
        assertTrue(result);
        verify(mockedNPrinterLib, times(2)).NOpenResult(printer);
    }

    @Test
    void openPrinterShouldReturnFalseAndInvokeNClosePrinterOnAnErrorStatus() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        String printer = "PRT001";

        // When
        when(mockedNPrinterLib.NOpenResult(printer))
                .thenReturn(NRet.ERR_PRTCLOSE);
        boolean result = nipponPrinterModule.openPrinter(printer);

        // Then
        assertFalse(result);
        verify(mockedNPrinterLib, times(1)).NOpenResult(printer);
        verify(mockedNPrinterLib, times(1)).NOpenPrinter(printer);
        verify(mockedNPrinterLib, times(1)).NClosePrinter(printer);
    }

    @Test
    void openPrinterShouldReturnFalseOnTheNinthRetry() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        String printer = "PRT001";

        // When
        when(mockedNPrinterLib.NOpenResult(printer)).thenReturn(NRet.OPEN_BEFORE);
        boolean result = nipponPrinterModule.openPrinter(printer);

        // Then
        assertFalse(result);
        verify(mockedNPrinterLib, times(20)).NOpenResult(printer);
        verify(mockedNPrinterLib, times(1)).NOpenPrinter(printer);
        verify(mockedNPrinterLib, times(1)).NClosePrinter(printer);
    }

    @Test
    void getPrinterStatusShouldResolveThePromiseWithASuccessStatusWhenThereAreNoIssues() {
        // Given
        ReactApplicationContext mockedReactApplicationContext = mock(ReactApplicationContext.class);
        NPrinterLib mockedNPrinterLib = mock(NPrinterLib.class);
        NipponPrinterModule nipponPrinterModule = new NipponPrinterModule(mockedReactApplicationContext, mockedNPrinterLib);
        String printer = "PRT001";
        Promise mockedPromise = mock(Promise.class);

        // When
        when(mockedNPrinterLib.NGetStatus(printer, new NInt(0x00000001))).thenReturn(NRet.SUCCESS);
        nipponPrinterModule.getPrinterStatus(printer, mockedPromise);

        // Then
        verify(mockedPromise).resolve(NipponPrinterStatus.SUCCESS.getValue());
    }
}
