import { call, takeLatest } from "redux-saga/effects"
import { SagaIterator } from "redux-saga"
import {
  NavigationActions,
  NavigationNavigateAction
} from "react-navigation"
import * as navigator from "../navigation"
import { AppScreens } from "../interfaces"

export interface RouteTransitionParams {
  current: AppScreens
  next: AppScreens,
  method: NavMethod
}

export enum NavMethod {
  // ts doesn't allow to use NavigationActions.BACK etc for some reason
  // have to duplicate strings
  BACK = "Navigation/BACK",
  NAVIGATE = "Navigation/NAVIGATE"
}

export interface RouteListenerResult {
  routeName: AppScreens
  pre?: () => any
  post?: () => any
}
const noop = () => false

/**
 * RouteListener, despite of what it is, function, generator, async function
 * MUST return or resolve promise with RouteListenerResult type
 * ts lacks support of return values from generators
 * @see https://github.com/Microsoft/TypeScript/issues/2983
 */
export type RouteListener = (routeParams: RouteTransitionParams, currentRoute: RouteListenerResult) =>
  RouteListenerResult | IterableIterator<RouteListenerResult> | SagaIterator

const _routeListeners: Set<RouteListener> = new Set()

export const subscribeRouteListener = (listener: RouteListener): void => {
  _routeListeners.add(listener)
}

export const unsubscribeRouteListener = (listener: RouteListener): void => {
  _routeListeners.delete(listener)
}

function* triggerRouteListeners(params: RouteTransitionParams) {
  const currentRoute: RouteListenerResult = {
    routeName: params.next
  }
  let nextRoute = currentRoute
  const nextParams = { ...params }
  // virtual creen traverse in request pipeline style
  // even if we need to skip screen
  // it might contain necessary pre/post condition
  for (const listener of _routeListeners) {
    const routeListenerResult = yield call(listener, nextParams, nextRoute)
    if (routeListenerResult !== nextRoute) {
      const { pre = noop, post = noop } = nextRoute
      // call pre/post condition of a route being skipped
      yield call(pre)
      yield call(post)
      nextRoute = routeListenerResult
      nextParams.next = nextRoute.routeName
    }
  }
  return nextRoute
}

function* navigate(action: NavigationNavigateAction): SagaIterator {
  const route = navigator.getCurrentRoute()
  const navDetails = {
    next: action.routeName as AppScreens,
    current: route ? route.routeName : route,
    method: NavMethod.NAVIGATE
  }
  // added <any> to fix error "Property 'context' is missing in type..."
  const resolution: RouteListenerResult = (yield call<any>(triggerRouteListeners, navDetails)) as any
  const {
    pre = noop,
    post = noop,
    routeName
  } = resolution

  yield call(pre)
  if (route && route.routeName !== routeName) {
    yield call(navigator.navigate, routeName)
  }
  yield call(post)
}

function* goBack(): SagaIterator {
  const prevRoute = navigator.getPrevRoute()
  const currentRoute = navigator.getCurrentRoute()
  if (!prevRoute || !currentRoute) {
    return
  }
  const navDetails = {
    next: prevRoute.routeName,
    current: currentRoute.routeName,
    method: NavMethod.BACK
  }

  const resolution: RouteListenerResult = (yield call<any>(triggerRouteListeners, navDetails)) as any
  const {
    pre = noop,
    post = noop,
    routeName,
  } = resolution

  yield call(pre)
  if (routeName) {
    yield call(navigator.navigate, routeName)
  } else {
    yield call(navigator.goBack)
  }
  yield call(post)
}

export const navigationSagas = [
  takeLatest(NavigationActions.NAVIGATE, navigate),
  takeLatest(NavigationActions.BACK, goBack),
]
