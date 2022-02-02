import React, { Component } from "react"
import { Keyboard, EmitterSubscription, ScrollViewProps } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export default class KeyboardResponsiveScrollView extends Component<ScrollViewProps> {

    private scroll?: any
    private handler?: EmitterSubscription

    public componentDidMount() {
        this.handler = Keyboard.addListener("keyboardWillHide", () => {
            // reset scrollview to top when done
            this.scroll.scrollToPosition(0, 0, true)
        })
    }

    public componentWillUnmount() {
        if (this.handler) {
            this.handler.remove()
        }
    }

    public render() {
        return <KeyboardAwareScrollView
            enableResetScrollToCoords={false}
            ref={(ref: any) => this.scroll = ref}
            {...this.props} >
            {this.props.children}
        </ KeyboardAwareScrollView>
    }

}
