import React from "react"
import {
  Animated,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native"
import { popup as styles } from "./styles"

export const SPEED = 500

interface Props {
  show: boolean;
  style?: StyleProp<ViewStyle>;
  text: string;
}

export default class Popup extends React.PureComponent<Props> {

  private readonly _opacity: Animated.Value = new Animated.Value(0)

  public componentWillReceiveProps(nextProps: Props) {
    const { show } = this.props
    if (show !== nextProps.show) {
      Animated.timing(this._opacity, {
        duration: SPEED,
        toValue: Number(nextProps.show)
      }).start()
    }
  }

  public render() {
    const { style, text } = this.props
    const opacity = { opacity: this._opacity }
    return (
      <Animated.View pointerEvents="none" style={[opacity, styles.popup, style]}>
        <Text style={styles.popupText}>{text}</Text>
      </Animated.View>
    )
  }
}
