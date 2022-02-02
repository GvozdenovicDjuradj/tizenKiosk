import React from "react"
import { BackHandler } from "react-native"
import {
  NavigationActions,
  NavigationEventPayload,
  NavigationEventSubscription,
  NavigationScreenProp,
} from "react-navigation"

export interface ComponentWithNavigationProps {
  goBackExtra: () => any;
  navigation: NavigationScreenProp<any>;
}

export default class ComponentWithNavigation<T extends ComponentWithNavigationProps> extends React.PureComponent<T> {

  private wipeListener?: NavigationEventSubscription

  public componentWillMount() {
    const { navigation } = this.props
    BackHandler.addEventListener("hardwareBackPress", this.goBack)
    this.wipeListener = navigation.addListener("willBlur", this.gestureBackHandler)
  }

  public componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.goBack)
    if (this.wipeListener) {
      this.wipeListener.remove()
    }
  }

  public gestureBackHandler = (payload: NavigationEventPayload) => {
    if (payload.action.type === NavigationActions.BACK) {
      if (this.props.goBackExtra) {
        this.props.goBackExtra()
      }
    }
  }

  public goBack = () => {
    this.props.navigation.dispatch(NavigationActions.back())
    return true
  }

}
