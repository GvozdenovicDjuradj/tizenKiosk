import React, { FunctionComponent } from "react"
import { Text, View, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from "react-native"
import RNPickerSelect, { Item } from "react-native-picker-select"
import { lifecycle, compose } from "recompose"
import { Printer } from "@dnlowman/react-native-star-prnt"

interface Style {
    container: ViewStyle;
    searching: TextStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderColor: "#dfdfdf",
        borderRadius: 5,
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15
    },
    searching: {
        fontSize: 20
    }
})

export interface PrinterSelectProps {
    isFindingPrinters: boolean;
    connectedPrinters: Item[];
    findConnectedPrinters: () => void;
    selectPrinter: (printer: Printer) => void;
    selectedPrinter: Printer | undefined;
}

export const PrinterSelect: FunctionComponent<PrinterSelectProps> =
    ({ isFindingPrinters, connectedPrinters, selectedPrinter, selectPrinter }) => {
        return (
            <View>
                {isFindingPrinters ?
                    <View style={styles.container}>
                        <Text style={styles.searching}>Searching for printers...</Text>
                        <ActivityIndicator size="small" color="red" />
                    </View>
                    :
                    <RNPickerSelect
                        placeholder={{
                            label: "Select a printer...",
                            value: null,
                        }}
                        items={connectedPrinters}
                        onValueChange={selectPrinter}
                        value={selectedPrinter} />
                }
            </View>
        )
    }

const enhance = compose<PrinterSelectProps, PrinterSelectProps>(
    lifecycle<PrinterSelectProps, {}>({
        componentDidMount() {
            this.props.findConnectedPrinters()
        }
    })
)

export default enhance(PrinterSelect)
