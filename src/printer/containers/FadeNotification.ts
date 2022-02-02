import { connect } from "react-redux"
import FadeNotification, { Props } from "../components/FadeNotification"
import { RootState } from "../../interfaces"
import { getIsNotificationVisible, getNotificationMessage, getNotificationTitle } from "../selectors"

const mapStateToProps = (state: RootState): Props => ({
    isVisible: getIsNotificationVisible(state),
    title: getNotificationTitle(state),
    message: getNotificationMessage(state),
})

export default connect(mapStateToProps)(FadeNotification)
