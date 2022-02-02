package com.rnqudinikiosk;

public enum NipponPrinterStatus {
    SUCCESS(0),
    PAPER_LOW(1),
    PAPER_EMPTY(2),
    COULD_NOT_PRINT(3);

    private final int value;

    NipponPrinterStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
