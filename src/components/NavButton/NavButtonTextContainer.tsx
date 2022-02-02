import { connect } from "react-redux"
import { RootState } from "../../interfaces"
import NavButtonText from "./NavButtonText"

const mapStateToProps = (state: RootState) => ({
    fontFamily: state.kiosk.settings && state.kiosk.settings.template && state.kiosk.settings.template.font
})

export default connect(mapStateToProps)(NavButtonText)
