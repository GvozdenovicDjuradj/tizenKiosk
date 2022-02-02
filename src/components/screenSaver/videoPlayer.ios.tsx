import React from "react"
import { WebView } from "react-native"
import { configureIOSPlayer } from "../../utils/screenSaver"

interface Props {
  source?: any
  onClick: () => void
}

const containerStyle = `
 width: 100%;
 height: 100%;
`

const videoStyle = `
  min-height: 100%;
  width: auto;
  position: absolute;
  top: 0;
  left: 50%;
`

export const Video = (props: Props) => {
  const resetScreensaver = () => {
    props.onClick()
  }

  return (
    <WebView
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      source={{ html: configureIOSPlayer(containerStyle, videoStyle, props.source.uri) }}
      onMessage={resetScreensaver}
      scrollEnabled={false}
    />
  )
}
