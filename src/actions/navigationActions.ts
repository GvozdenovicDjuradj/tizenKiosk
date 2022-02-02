import { NavigationActions } from "react-navigation"
import { AppScreens } from "../interfaces"
import { Actions } from "../actions"

export const goToPrivacyPolicyScreen = (): Actions => (
  NavigationActions.navigate({
    routeName: AppScreens.PRIVACY_POLICY,
    key: AppScreens.PRIVACY_POLICY,
  })
)

export const goToCustomerDetailsScreen = (): Actions => (
  NavigationActions.navigate({
    key: AppScreens.CUSTOMER_DETAILS,
    routeName: AppScreens.CUSTOMER_DETAILS
  })
)
export const goToServiceSelectionScreen = (): Actions => (
  NavigationActions.navigate({
    key: AppScreens.SERVICE_SELECTION,
    routeName: AppScreens.SERVICE_SELECTION
  })
)

export const goToEventCheckInScreen = (): Actions => (
  NavigationActions.navigate({
    key: AppScreens.EVENT_CHECK_IN,
    routeName: AppScreens.EVENT_CHECK_IN,
  })
)

export const goToCheckInScreen = (): Actions => (
    NavigationActions.navigate({
      key: AppScreens.CHECK_IN,
      routeName: AppScreens.CHECK_IN
  })
)

export const goToQueueFullOrNAScreen = (): Actions => (
    NavigationActions.navigate({
      key: AppScreens.QUEUE_FULL_OR_NA,
      routeName: AppScreens.QUEUE_FULL_OR_NA
  })
)

export const goToUnderCapacityScreen = (): Actions =>
  NavigationActions.navigate({
    key: AppScreens.QUEUE_UNDER_OCCUPANCY,
    routeName: AppScreens.QUEUE_UNDER_OCCUPANCY,
  });

export const goToQuestionsScreen = (): Actions => (
    NavigationActions.navigate({
      key: `${AppScreens.QUESTIONS}_0`,
      routeName: AppScreens.QUESTIONS
  })
)

export const goToQueueConfirmationScreen = (): Actions => (
    NavigationActions.navigate({
      key: AppScreens.QUEUE_CONFIRMATION,
      routeName: AppScreens.QUEUE_CONFIRMATION
  })
)

export const goToCheckInConfirmationScreen = (): Actions => (
  NavigationActions.navigate({
    key: AppScreens.CHECK_IN_CONFIRMATION,
    routeName: AppScreens.CHECK_IN_CONFIRMATION
  })
)

export const goToEventCheckInConfirmationScreen = (): Actions => (
    NavigationActions.navigate({
      key: AppScreens.EVENT_CHECK_IN_CONFIRMATION,
      routeName: AppScreens.EVENT_CHECK_IN_CONFIRMATION
  })
)
