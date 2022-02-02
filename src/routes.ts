import { Animated } from "react-native"
import {
  createAppContainer,
  createStackNavigator,
  NavigationTransitionProps,
} from "react-navigation"
import AppNavigator from "./AppNavigator"
import { AppScreens } from "./interfaces"

const fadeIn = (duration = 300) => ({
  containerStyle: {
    backgroundColor: "transparent"
  },
  transitionSpec: {
    duration,
    timing: Animated.timing,
    useNativeDriver: true
  },
  screenInterpolator: ({ position, scene }: NavigationTransitionProps) => {
    const { index } = scene
    const opacity = position.interpolate({
      inputRange: [index - 1, index],
      outputRange: [0, 1]
    })
    return { opacity }
  }
})

const AppRouter = createStackNavigator({
  [AppScreens.HOME]: AppNavigator,
  [AppScreens.SERVICE_SELECTION]: AppNavigator,
  [AppScreens.KIOSK_CLOSED]: AppNavigator,
  [AppScreens.CUSTOMER_DETAILS]: AppNavigator,
}, {
  cardStyle: { backgroundColor: "transparent" },
  headerMode: "none",
  initialRouteName: AppScreens.HOME,
  mode: "card",
  transitionConfig: () => fadeIn(),
  transparentCard: true,
})

export default createAppContainer(AppRouter)
