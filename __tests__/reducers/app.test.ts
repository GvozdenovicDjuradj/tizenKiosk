import { APP, OTHER_ACTION } from "../../src/actions/types"
import appReducer, { initialState } from "../../src/reducers/app"
import { AppScreens, AppState } from "../../src/interfaces"

describe("app reducer tests", () => {

  it(`should set empty object as initial state`, () => {
    expect(appReducer({} as AppState, { type: OTHER_ACTION })).not.toEqual(initialState)
  })

  it(`should set initial state`, () => {
    expect(appReducer(initialState, { type: OTHER_ACTION })).toEqual(initialState)
  })

  it(`should switch offline flag to "true"`, () => {
    expect(appReducer(
      initialState,
      { type: APP.OFFLINE.REQUEST })
    ).toEqual({ ...initialState, offline: true })
  })

  it(`should switch offline flag to "false"`, () => {
    expect(appReducer(
      { ...initialState, offline: true },
      { type: APP.ONLINE.REQUEST })
    ).toEqual(initialState)
  })

  it(`should change initial page`, () => {
    expect(appReducer(initialState,
      { type: APP.CHANGE_INITIAL_PAGE.REQUEST, payload: AppScreens.CHECK_IN })
    ).toEqual({ ...initialState, initialScreen: AppScreens.CHECK_IN })
  })

  it(`should change keyboard state`, () => {
    expect(appReducer(initialState,
      { type: APP.KEYBOARD_STATE_CHANGE, payload: true })
    ).toEqual({ ...initialState, keyboardDisplayed: true })
  })

  it(`should change deviceImei state`, () => {
    expect(appReducer(initialState,
      { type: APP.PHONE_STATE_PERMISSION.SUCCESS, payload: { deviceImei: "333" } })
    ).toEqual({ ...initialState, deviceImei: "333" })
  })

})
