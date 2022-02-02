import { connect } from "react-redux"
import * as selectors from "../selectors"
import { Printer } from "@dnlowman/react-native-star-prnt"
import { RootState } from "../../interfaces"
import Ticket from "../components/Ticket"
import {
    ticketPrinted,
    printTicketRejected,
    appendPrinterDebugOutput, displayPrinterNotification, hidePrinterNotification, setDebugOutput
} from "../actionCreators"

interface MappedTicketProps extends Printer {
    logoUrl: string;
    ticketMessage: string;
    showAtTopValue: string;
    localCurrentTime: string;
    localCurrentDate: string;
    logoFooterUrl: string;
    isPendingPrint: boolean;
    isCurrentPrintATest: boolean;
}

interface DispatchProps {
    ticketPrinted: typeof ticketPrinted;
    printTicketRejected: typeof printTicketRejected;
    appendPrinterDebugOutput: typeof appendPrinterDebugOutput;
    displayPrinterNotification: typeof displayPrinterNotification;
    hidePrinterNotification: typeof hidePrinterNotification;
    setDebugOutput: typeof setDebugOutput;
}

const mapStateToProps = (state: RootState): MappedTicketProps => {
    return {
        ...selectors.getSelectedPrinter(state),
        logoUrl: selectors.getLogoUrl(state),
        ticketMessage: selectors.getTicketMessage(state),
        showAtTopValue: selectors.getShowAtTopValue(state),
        localCurrentTime: selectors.getLocalCurrentTime(state),
        localCurrentDate: selectors.getLocalCurrentDate(state),
        logoFooterUrl: selectors.getLogoFooterUrl(state),
        isPendingPrint: selectors.getIsPendingPrint(state),
        isCurrentPrintATest: selectors.getIsCurrentPrintATest(state),
    }
}

const mapDispatchToProps: DispatchProps = {
    ticketPrinted,
    printTicketRejected,
    appendPrinterDebugOutput,
    displayPrinterNotification,
    hidePrinterNotification,
    setDebugOutput,
}

export default connect(mapStateToProps, mapDispatchToProps)(Ticket)
