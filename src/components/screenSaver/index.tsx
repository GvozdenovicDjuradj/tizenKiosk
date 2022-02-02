import React from "react"
import { StyleSheet, TouchableWithoutFeedback } from "react-native"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { Action } from "../../actions/types"
import { RootState } from "../../interfaces"
import { getScreenSaverVideo } from "../../utils/selectors"
import { hideScreenSaver } from "../../actions/screenSaver"
import { Video } from "./videoPlayer"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    minHeight: "100%"
  }
})

interface PropsFromState {
  video: string | null
}

interface PropsFromDispatch {
  hideScreenSaver: () => Action
}

type Props = PropsFromState & PropsFromDispatch

class ScreenSaver extends React.Component<Props> {
  public player: any = null

  public render() {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={this.props.hideScreenSaver}>
        <Video
          onClick={this.props.hideScreenSaver}
          source={{ uri: this.props.video }}
          style={styles.backgroundVideo}
          repeat
          muted
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  hideScreenSaver: () => dispatch(hideScreenSaver())
})

const mapStateToProps = (state: RootState) => ({
  video: getScreenSaverVideo(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSaver)
