import { PermissionsAndroid } from "react-native"

export async function requestReadPhoneState() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      {
        title: "Access to read phone state",
        message: "Qudini Kiosk needs to have permission to manage phone calls",
        buttonPositive: "Accept"
      }
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  } catch (err) {
    return false
  }
}
