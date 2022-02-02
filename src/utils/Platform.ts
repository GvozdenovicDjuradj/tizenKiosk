import { Platform } from "react-native"

export const isPlatformAndroidOrIos = (): boolean =>
    Platform.OS === "android" || Platform.OS === "ios"
