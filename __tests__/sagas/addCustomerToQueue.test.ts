import { expectSaga, testSaga } from "redux-saga-test-plan"
import { call } from "redux-saga-test-plan/matchers"
import { createState, createCustomerInQueue, createKioskState } from "../fixtures"
import { APP, ADD_CUSTOMER_TO_QUEUE_START } from "../../src/actions/types"
import { goToQueueFullOrNAScreen, addCustomerToQueueSuccess, addCustomerToQueueReset } from "../../src/actions"
import { addCustomerToQueue, addPlusSymbolToCallingCodeIfMissing } from "../../src/sagas/kiosk"
import callApi from "../../src/sagas/api"
import { CustomerInQueue, KioskState } from "../../src/interfaces";

import { reducer, initialState } from '../../src/reducers/kiosk';
import { AnyAction } from "redux"
import { Action } from "../../src/actions/validation"



describe("Add customer to queue saga tests", () => {
    describe(`the exported addPlusSymbolToCallingCodeIfMissing function`, () => {
        it(`should add the plus symbol when the parameter is truthy`, () => {
            // Given
            const callingCode = "44"

            // When
            const result = addPlusSymbolToCallingCodeIfMissing(callingCode)

            // Then
            expect(result).toBe(`+${callingCode}`)
        })

        it(`should not add the plus symbol when the callingCode already contains one`, () => {
            // Given
            const callingCode = "+44"

            // When
            const result = addPlusSymbolToCallingCodeIfMissing(callingCode)

            // Then
            expect(result).toBe(callingCode)
        })

        it(`should return the parameter as-is if it is falsy`, () => {
            // Given
            const callingCode = undefined

            // When
            const result = addPlusSymbolToCallingCodeIfMissing(callingCode)

            // Then
            expect(result).toBe(callingCode)
        })
    })

    it("should fail to add customer to queue", () => {
        const state = createState()

        const response = {
            data: {
                error: {
                    description: "Failed to add customer to queue"
                }
            }
        }

        return expectSaga(addCustomerToQueue)
            .withState(state)
            .provide([
                [call.fn(callApi), response]
            ])
            .put(addCustomerToQueueReset())
            .put(goToQueueFullOrNAScreen())
            .run()
    })

    it("should add customer to queue successfully", () => {
        const state = createState()

        const response = {
            data: {
                success: {
                    customerInQueue: createCustomerInQueue()
                }
            }
        }

        return expectSaga(addCustomerToQueue)
            .withState(state)
            .provide([
                [call.fn(callApi), response],
            ])
            .provide({
                race: () => ({
                    response,
                    action: { type: APP.GO_INITIAL_SCREEN.REQUEST },
                }),
            })
            .put(addCustomerToQueueSuccess(response.data.success.customerInQueue as CustomerInQueue))
            .run()
    })

    it('should set isAddingCustomerToQueue to true', () => {
      const state = createState();
      
      return expectSaga(addCustomerToQueue)
        .withState(state)
        .put({ type: ADD_CUSTOMER_TO_QUEUE_START })
        .run();
    });

    it('should not yield anything when isAddingCustomerToQueue is true', () => {
      const state = createState({
        kiosk: createKioskState({ isAddingCustomerToQueue: true, }),
      });
      
      return expectSaga(addCustomerToQueue)
        .withState(state)
        .not.put({ type: ADD_CUSTOMER_TO_QUEUE_START })
        .run();
    })
})
