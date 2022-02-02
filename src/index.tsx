import "babel-polyfill"
import { AppRegistry } from "react-native"
import App from "./App"
import app from "../app.json"

AppRegistry.registerComponent(app.name, () => App)

if (window && typeof window === "object" && window.document) {
  AppRegistry.runApplication(app.name, { rootTag: document.getElementById("app") })
}
