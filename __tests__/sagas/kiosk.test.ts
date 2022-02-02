import { Action } from "redux"
import { getKioskIdAndDomainFromUrl } from "../../src/actions"
import { getKioskIdAndDomainFromUrl as getKioskIdAndDomainFromUrlSaga } from "../../src/sagas/kiosk"
import { runSaga } from "redux-saga"
import { createState } from "../fixtures"
import { getKioskIdAndDomainFromWindow } from "../../src/utils/url"

jest.mock("../../src/utils/url", () => ({
    getKioskIdAndDomainFromWindow: jest.fn()
}))

describe(`the kiosk saga module`, () => {
    it(`should export getKioskIdAndDomainFromUrl which dispatches the correct actions`, async () => {
      // Given
      (getKioskIdAndDomainFromWindow as jest.Mock).mockImplementation(() => ({
          kioskId: "TEST",
          domain: "https://qa.qudini.com",
      }))

      const dispatched: Action[] = []
      const printTicketAction = getKioskIdAndDomainFromUrl()
      const state = createState()

      // When
      await runSaga({
          dispatch: (action: Action) => { dispatched.push(action) },
          getState: () => state
      }, getKioskIdAndDomainFromUrlSaga, printTicketAction)

      // Then
      expect(dispatched).toHaveLength(6)
    })
})
