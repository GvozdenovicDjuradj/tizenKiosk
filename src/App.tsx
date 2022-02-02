import React, { Component } from "react"
import { Store } from "redux"
import { Provider } from "react-redux"
import { StatusBar, View, PermissionsAndroid, Platform } from "react-native"
import { PersistGate } from "redux-persist/integration/react"
import { Navigator as NavigatorType, setNavigator } from "./navigation"
import Navigator from "./routes"
import { applicationStart, initApp as initAppActionCreator, stopApp } from "./actions/app"
import { RootState } from "./interfaces"
import { persistor, store } from "./store"
import { setup } from "./utils/localeString"
import Modals from "./modals"
import Printing from "./components/Printing"
import Ticket from "./printer/containers/Ticket"
import Notification from "./components/Notification"
import initSentry from "./initSentry"
import { getKioskIdAndDomainFromUrl } from "./actions"
import FadeNotification from "./printer/containers/FadeNotification"

if (Platform.OS !== "web") {
    initSentry()
}

setup(store)

if (Platform.OS === "web") {
    setTimeout(() => {
        store.dispatch(getKioskIdAndDomainFromUrl())
    }, 0)
}

setTimeout(() => store.dispatch(applicationStart()))

const start = (store$: Store<RootState>, navigator: NavigatorType) => {
    if (navigator) {
        setNavigator(navigator)
        store$.dispatch(initAppActionCreator())

    } else {
        store$.dispatch(stopApp())
    }
}

export default class App extends Component {
    public async componentDidMount() {
        if (Platform.OS === "android") {
            // TODO - This should be re-prompted in settings later, I will handle this in a later ticket
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: "Qudini Kiosk - Printing",
                message: `We require access to read a configuration
                file which stores internal settings for the connected
                printer, in addition we also need to read saved tickets
                which we save to external storage as an image.`,
                buttonNegative: "Decline",
                buttonPositive: "Accept",
              },
            )

            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: "Qudini Kiosk - Printing",
                message: `We require access to write to a configuration
                  file which stores internal settings for the connected
                  printer, in addition we also need to write saved tickets
                  which we save to external storage as an image.`,
                buttonNegative: "Decline",
                buttonPositive: "Accept",
              },
            )
        }
    }

    public render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <View style={{ flex: 1 }}>
                        <StatusBar hidden/>
                        <Ticket/>
                        <View style={{ flex: 1, width: "100%", height: "100%", overflow: "hidden" }}>
                            <Modals/>
                            <Notification/>
                            <Navigator ref={(navigator: NavigatorType) => start(store, navigator)}/>
                            <Printing />
                        </View>
                        <FadeNotification />
                    </View>
                </PersistGate>
            </Provider>
        )
    }
}
