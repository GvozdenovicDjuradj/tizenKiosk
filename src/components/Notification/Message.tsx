import React from "react"
import { Animated } from "react-native"
import styled from "styled-components/native"

const Text = styled.Text`
  color: #fff;
  font-size: 28px;
  text-align: center;
`

const View = styled.View`
  align-items: center;
  background-color: #c5383a;
  justify-content: center;
  min-height: 90px;
  padding: 5px 15px;
  width: 100%;
`

interface Props {
  text?: string
  done?: () => void
}

export default class NotificationMessage extends React.PureComponent<Props> {

  public readonly ANIMATION_DURATION = 500
  public readonly DISPLAY_DURATION = 4000
  public opacity = new Animated.Value(0)

  public componentDidMount() {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: this.ANIMATION_DURATION
    }).start(() => {
      Animated.timing(this.opacity, {
        toValue: 0,
        delay: this.DISPLAY_DURATION,
        duration: this.ANIMATION_DURATION
      }).start(this.props.done)
    })
  }

  public render() {
    return (
      <Animated.View style={{ flex: 1, opacity: this.opacity }}>
        <View>
          <Text>{this.props.text}</Text>
        </View>
      </Animated.View>
    )
  }

}
