import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"

export default Platform.select({
  web: "n/a",
  default: DeviceInfo.getReadableVersion()
})
