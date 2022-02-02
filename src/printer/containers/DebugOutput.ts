import { connect } from "react-redux"
import { RootState } from "../../interfaces"
import DebugOutput from "../components/DebugOutput"
import { getDebugOutput, getNotificationMessage, getNotificationTitle } from "../selectors"

const mapStateToProps = (state: RootState) => ({
    debugOutput: getDebugOutput(state),
    notificationTitle: getNotificationTitle(state),
    notificationMessage: getNotificationMessage(state)
})

export default connect(mapStateToProps)(DebugOutput)
