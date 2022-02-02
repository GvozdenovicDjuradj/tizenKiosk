import { AppScreens } from "./routes"

export interface RouteItem {
  routeName: AppScreens
  key: string
  params?: object
}
