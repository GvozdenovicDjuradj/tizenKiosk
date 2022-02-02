import React from "react"
import { View, Text } from "react-native"
import { getLocaleString } from "../utils/localeString"
const NoConnectionModal = () => {
    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#bb222f"
            }}
        >
            <Text style={{fontSize: 80, color: "#ffffff"}}>
                {getLocaleString("notificationMessages.error.kiosk.offline")}
            </Text>
        </View>
    )
}

export default NoConnectionModal
