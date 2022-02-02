import { BackHandler, NativeEventSubscription } from "react-native"

const callBackHandler = (callback?: () => void) => {
    if (callback) {
      callback()
    }
    return true
}

/**
 * Attaches an event listener that handles the hardware back button
 * @param  { Function } callback The function to call on click
 */
const handleBackButton = (callback?: () => void): NativeEventSubscription =>
    BackHandler.addEventListener("hardwareBackPress", () => callBackHandler(callback))

/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeBackButtonHandler = (callback?: () => void): void =>
    BackHandler.removeEventListener("hardwareBackPress", () => callBackHandler(callback))

export { handleBackButton, removeBackButtonHandler }
