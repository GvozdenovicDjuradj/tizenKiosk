import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationRoute,
  NavigationState,
  StackActions,
} from "react-navigation"
import { AppScreens } from "./interfaces"

export type Navigator = NavigationContainerComponent & { state: { nav: NavigationState }}

let _navigator: Navigator

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
function isNavState(route: NavigationRoute | NavigationState): route is NavigationState {
  return Array.isArray((route as NavigationState).routes)
}

export const setNavigator = (navigator: Navigator): void => {
  if (navigator) {
    _navigator = navigator
  }
}

export const goBack = (): void => {
  _navigator.dispatch(NavigationActions.back())
}

export const navigate = (screen: AppScreens) => {
  const action = NavigationActions.navigate({
    key: screen,
    routeName: screen
  })
  _navigator.dispatch(action)
}

export const reset = (initialScreen: AppScreens) => {
  const action = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: initialScreen,
        action: NavigationActions.navigate({
          key: initialScreen,
          routeName: initialScreen,
        })
      })
    ]
  })
  _navigator.dispatch(action)
}

export const getCurrentRoute = (): NavigationRoute | undefined => {
  const navState = _navigator && _navigator.state
  if (navState) {
    const route = navState.nav.routes[navState.nav.index]
    if (isNavState(route)) {
      return route.routes[route.index]
    } else {
      return route
    }
  }
  return undefined
}

export const getPrevRoute = (): NavigationRoute | undefined => {
  const navState = _navigator && _navigator.state
  if (navState && navState.nav.routes.length > 1) {
    return navState.nav.routes[navState.nav.index - 1]
  } else {
    return undefined
  }
}
