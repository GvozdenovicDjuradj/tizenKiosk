import { NavigationRoute, NavigationState } from "react-navigation"
import { AppScreens } from "../interfaces"
import { getCurrentRoute } from "../navigation"

const isNavState = (obj: NavigationState | NavigationRoute): obj is NavigationState => "routes" in obj

export const getRouteName = (): AppScreens | undefined => {
  const route = getCurrentRoute()
  let screenName
  if (route) {
    if (isNavState(route)) {
      screenName = route.routes[route.index].routeName as AppScreens
    } else if (route.routeName) {
      screenName = route.routeName as AppScreens
    }
  }
  return screenName
}
