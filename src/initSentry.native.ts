import * as Sentry from "@sentry/react-native"
import pkg from "../package.json"
import { store } from "./store"

const key = pkg.sentry.key

const initSentryNative = () => {
    Sentry.init({
        dsn: key,
        environment: __DEV__ ? "development" : "production",
        beforeSend(event) {
            const state = store.getState()

            event.extra = {
                ...event.extra,
                kioskId: state.kiosk.kioskId,
                serial: state.kiosk.serial,
                url: state.kioskSettings.url,
                hasPrinter: state.kioskSettings.hasPrinter,
                kioskIdentifier: state.kioskSettings.kioskIdentifier,
                connectedPrinters: state.printer.connectedPrinters.map((x) => x.portName).join(", ")
            }

            return event
        }
    })

    Sentry.setRelease(pkg.version)
}

export default initSentryNative
