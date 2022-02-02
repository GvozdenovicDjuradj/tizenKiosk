import React, { Component } from "react"
import { Animated, StyleProp, ViewStyle } from "react-native"

const FADE_DURATION = 750

export interface Props {
    visible: boolean;
    style: StyleProp<ViewStyle>;
}

export interface State {
    visible: boolean;
    fadeAnim: Animated.Value;
}

export default class Fade extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            visible: props.visible,
            fadeAnim: new Animated.Value(0)
        }
    }

    public componentDidMount(): void {
        if (!this.props.visible) {
            return
        }

        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: this.props.visible ? 1 : 0,
                duration: FADE_DURATION,
            }
        ).start()
    }

    public componentDidUpdate(prevProps: Readonly<Props>): void {
        if (prevProps.visible === this.props.visible) {
            return;
        }

        if (this.props.visible) {
            this.setState({ visible: this.props.visible })
        }

        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: this.props.visible ? 1 : 0,
                duration: FADE_DURATION,
            }
        ).start(() => this.setState({ visible: this.props.visible }))
    }

    public render() {
        return (
            <Animated.View style={{ ...this.props.style as any, opacity: this.state.fadeAnim }}>
                {this.state.visible && this.props.children}
            </Animated.View>
        );
    }
}
