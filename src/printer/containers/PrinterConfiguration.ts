import { Printer } from "@dnlowman/react-native-star-prnt"
import { List } from "immutable"
import { connect, MapDispatchToPropsNonObject } from "react-redux"
import { RootState } from "../../interfaces"
import { findConnectedPrinters, selectPrinter, setPrinterEnabled, toggleDebugOutput } from "../actionCreators"
import PrinterConfiguration from "../components/PrinterConfiguration"
import {
    getIsDebugOutputVisible,
    getIsFindingPrinters,
    getIsPendingPrint,
    getIsPrinterEnabled,
    getSelectedPrinter
} from "../selectors"
import { printTicket } from "../../actions"
import { testCustomerInQueue } from "../utils"

const mapStateToProps = (state: RootState) => ({
    availablePrinters: List.of(...state.printer.connectedPrinters).toArray(),
    isFindingPrinters: getIsFindingPrinters(state),
    isPrinterEnabled: getIsPrinterEnabled(state),
    selectedPrinter: getSelectedPrinter(state),
    isPendingPrint: getIsPendingPrint(state),
    isDebugOutputVisible: getIsDebugOutputVisible(state),
})

const mapDispatchToProps: MapDispatchToPropsNonObject<{}, {}> = (dispatch) => ({
    searchForPrinters: () => dispatch(findConnectedPrinters()),
    selectPrinter: (printer: Printer) => dispatch(selectPrinter(printer)),
    setPrinterEnabled: (enabled: boolean) => {
        dispatch(setPrinterEnabled(enabled))
        if (enabled) {
            dispatch(findConnectedPrinters())
        }
    },
    printTicket: () => { dispatch(printTicket(testCustomerInQueue, true)) },
    toggleDebugOutput: () => dispatch(toggleDebugOutput()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PrinterConfiguration);
