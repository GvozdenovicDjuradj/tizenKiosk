import {
  addPrivateCustomerToQueueRequest,
  addPrivateCustomerToQueueSuccess,
  addPrivateCustomerToQueueFail,
  addPrivateCustomerToQueueError
} from "../../src/actions/"
import { KIOSK } from "../../src/actions/types"
import { createCustomerInQueue } from "../fixtures"

describe("The addPrivateCustomerToQueue action creators", () => {

  describe("addPrivateCustomerToQueueRequest", () => {
    it("should return the correct action", () => {
      // When
      const action = addPrivateCustomerToQueueRequest()

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.REQUEST)
    })
  })

  describe("addPrivateCustomerToQueueSuccess", () => {
    it("should return the correct action", () => {
      // When
      const customerInQueue = createCustomerInQueue()
      const payload = {
        customerInQueue
      }
      const action = addPrivateCustomerToQueueSuccess(customerInQueue)

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.SUCCESS)
      expect(action).toHaveProperty("payload", payload)
    })
  })

  describe("addPrivateCustomerToQueueFail", () => {
    it("should return the correct action", () => {
      // When
      const action = addPrivateCustomerToQueueFail()

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.FAILURE)
    })
  })

  describe("addPrivateCustomerToQueueError", () => {
    it("should return the correct action", () => {
      // When
      const errorPayload = {
        title: "Error Title",
        message: "Error Message"
      }
      const action = addPrivateCustomerToQueueError(errorPayload)

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.ADD_PRIVATE_CUSTOMER_TO_QUEUE.FAILURE)
    })
  })
})
