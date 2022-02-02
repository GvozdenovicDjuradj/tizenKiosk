import React from "react"
import Content from "./Content"
import Header from "../Header"
import { keyboardView } from "./styles"
import KeyboardResponsiveScrollView from "../keyboard/KeyboardResponsiveScrollView"

export default () => {
    return (
      <KeyboardResponsiveScrollView
        contentContainerStyle={keyboardView.main}
      >
        <Header text="Kiosk setup" />
        <Content />
      </KeyboardResponsiveScrollView>
  )
}
