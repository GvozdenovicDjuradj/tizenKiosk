import { connect } from "react-redux"
import PrinterSelect from "../components/PrinterSelect"
import {
    findConnectedPrinters,
    selectPrinter
} from "../actionCreators"
import { RootState } from "../../interfaces"
import {
    getIsFindingPrinters,
    getPrinterSelectItems,
    getSelectedPrinter
} from "../selectors"

const mapStateToProps = (state: RootState) => ({
    isFindingPrinters: getIsFindingPrinters(state),
    connectedPrinters: getPrinterSelectItems(state),
    selectedPrinter: getSelectedPrinter(state)
})

const mapDispatchToProps = {
    findConnectedPrinters,
    selectPrinter
}

export default connect(mapStateToProps, mapDispatchToProps)(PrinterSelect)
