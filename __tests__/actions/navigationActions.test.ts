import {
  goToPrivacyPolicyScreen,
  goToCustomerDetailsScreen,
  goToServiceSelectionScreen,
  goToEventCheckInScreen,
  goToCheckInScreen,
  goToQueueFullOrNAScreen,
  goToQuestionsScreen,
  goToQueueConfirmationScreen,
  goToCheckInConfirmationScreen,
  goToEventCheckInConfirmationScreen
} from "../../src/actions/navigationActions"
import { AppScreens } from "../../src/interfaces"

describe("The kiosk action creators", () => {
    describe("goToPrivacyPolicyScreen", () => {
        it("should return the correct action with correct route", () => {
            // When
            const action = goToPrivacyPolicyScreen()

            // Then
            expect(action).not.toBeNull()
            expect(action).toHaveProperty("routeName", AppScreens.PRIVACY_POLICY)
            expect(action).toHaveProperty("key", AppScreens.PRIVACY_POLICY)
        })
    })
    describe("goToCustomerDetailsScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToCustomerDetailsScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.CUSTOMER_DETAILS)
          expect(action).toHaveProperty("key", AppScreens.CUSTOMER_DETAILS)
      })
  })
    describe("goToServiceSelectionScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToServiceSelectionScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.SERVICE_SELECTION)
          expect(action).toHaveProperty("key", AppScreens.SERVICE_SELECTION)
      })
  })
  //
    describe("goToEventCheckInScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToEventCheckInScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.EVENT_CHECK_IN)
          expect(action).toHaveProperty("key", AppScreens.EVENT_CHECK_IN)
      })
})
    describe("goToCheckInScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToCheckInScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.CHECK_IN)
          expect(action).toHaveProperty("key", AppScreens.CHECK_IN)
      })
    })
    describe("goToQueueFullOrNAScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToQueueFullOrNAScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.QUEUE_FULL_OR_NA)
          expect(action).toHaveProperty("key", AppScreens.QUEUE_FULL_OR_NA)
      })
    })
    describe("goToQuestionsScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToQuestionsScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.QUESTIONS)
          expect(action).toHaveProperty("key", `${AppScreens.QUESTIONS}_0`)
      })
    })
    describe("goToQueueConfirmationScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToQueueConfirmationScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.QUEUE_CONFIRMATION)
          expect(action).toHaveProperty("key", AppScreens.QUEUE_CONFIRMATION)
      })
    })
    describe("goToCheckInConfirmationScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToCheckInConfirmationScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.CHECK_IN_CONFIRMATION)
          expect(action).toHaveProperty("key", AppScreens.CHECK_IN_CONFIRMATION)
      })
    })
    describe("goToEventCheckInConfirmationScreen", () => {
      it("should return the correct action with correct route", () => {
          // When
          const action = goToEventCheckInConfirmationScreen()

          // Then
          expect(action).not.toBeNull()
          expect(action).toHaveProperty("routeName", AppScreens.EVENT_CHECK_IN_CONFIRMATION)
          expect(action).toHaveProperty("key", AppScreens.EVENT_CHECK_IN_CONFIRMATION)
      })
    })
})
