import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import styles from "./styles"

const DeviceInfoRow = styled.View`
  flex-direction: row;
  margin-bottom: 5;
  align-items: flex-end;
`

const DeviceInfoRowTitle = styled.Text`
  ${styles.textStyles};
  font-size: 20px;
`
const DeviceInfoRowValue = styled.Text`
  ${styles.textStyles};
  font-size: 16px;
`

interface Props {
  deviceImei?: string | null
  version: string
  uniqueId: string
}

export const DeviceInfoContainer = (props: Props) => {
  const { uniqueId, version, deviceImei } = props
  return (
    <View style={{ marginBottom: 10 }}>
      <DeviceInfoRow>
        <DeviceInfoRowTitle>
          Device ID:&nbsp;
        </DeviceInfoRowTitle>
        <DeviceInfoRowValue>
          {uniqueId}
        </DeviceInfoRowValue>
      </DeviceInfoRow>
      <DeviceInfoRow>
        <DeviceInfoRowTitle>
          IMEI:&nbsp;
        </DeviceInfoRowTitle>
        <DeviceInfoRowValue>
          {deviceImei || "Qudini Kiosk needs to have permission to manage phone calls"}
        </DeviceInfoRowValue>
      </DeviceInfoRow>
      <DeviceInfoRow>
        <DeviceInfoRowTitle>
          App version:&nbsp;
        </DeviceInfoRowTitle>
        <DeviceInfoRowValue>
          {version}
        </DeviceInfoRowValue>
      </DeviceInfoRow>
    </View>
  )
}
