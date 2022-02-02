import React from "react"
import { FlexStyle } from "react-native"
import styled from "styled-components"

const VideoContainer = styled.video`
  min-height: 100%;
  width: auto;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
`

const VideoContainerWrapper = styled.div`
  width: 100%;
  height: 100%;
`

interface Props {
  repeat: boolean
  source?: any
  resizeMode?: string
  style?: FlexStyle
  onClick: () => void
  muted?: boolean
}

export const Video = (props: Props) => (
  <VideoContainerWrapper onClick={props.onClick}>
    <VideoContainer
      loop={props.repeat}
      autoPlay
      muted
      src={props.source.uri}
    />
  </VideoContainerWrapper>
)
