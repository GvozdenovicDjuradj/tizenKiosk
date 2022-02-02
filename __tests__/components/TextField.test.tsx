import React from "react"
// import { TextInput, TouchableOpacity, View } from "react-native"
import renderer from "react-test-renderer"
import { Provider } from "react-redux"
import mockStore from "redux-mock-store"
import InputWrapper from "../../src/components/TextField/WrappedInput"
import { TextField } from "../../src/components/TextField/TextField"
// import Popup from "../../src/components/TextField/Popup"
import { AppScreens } from "../../src/interfaces"
import { validators } from "../../src/utils"
// import { VALIDATION_STATE_CHANGE } from "../../src/actions/types"

const createKioskSettingsState = () => ({
  settings: {
    template: {
      font: "Arial"
    }
  }
})

jest.mock("../../src/utils/getRouteName", () => ({
  getRouteName: () => "HOME"
}))

describe("TextField tests", () => {

  it("should render TextField successfully", () => {
    const store = mockStore()({
      validation: { [AppScreens.HOME]: { test: { error: [] } } },
      kiosk: createKioskSettingsState()
    })
    const tree = renderer.create(
      <Provider store={store}>
        <InputWrapper name="test" />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("should render TextField and pass provided props to it", () => {
    const tree = renderer.create(
      <TextField autoCorrect={false} keyboardType="numeric" />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("should render TextField wrapped in View", () => {
    const store = mockStore()({
      validation: { [AppScreens.HOME]: { test: { error: [] } } },
      kiosk: createKioskSettingsState()
    })
    const tree = renderer.create(
      <Provider store={store}>
        <InputWrapper name="test" validate={validators.strlen} />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  // it("should dispatch validation state change action", () => {
  //   const store = mockStore()({
  //     validation: { [AppScreens.HOME]: { test: { error: [] } } }
  //   })
  //   const handler = jest.fn()
  //   const wrapper = shallow(
  //     <InputWrapper
  //       name="test"
  //       validate={validators.strlen}
  //       onEndEditing={handler}
  //     />,
  //     { context: { store } }
  //   ).dive()
  //   expect(wrapper.find(View).length).toBe(2)
  //   expect(wrapper.find(TextField).length).toBe(1)
  //   wrapper.find(TextField).simulate(
  //     "endEditing",
  //     { nativeEvent: { text: "" } }
  //   )
  //   expect(handler).toBeCalled()
  //   expect(store.getActions()).toEqual([{
  //     type: VALIDATION_STATE_CHANGE,
  //     payload: {
  //       [AppScreens.HOME]: {
  //         test: { error: ["String is empty"], valid: false }
  //       }
  //     }
  //   }])
  // })

  // it("should dispatch validation state change action for mobile number field", () => {
  //   const store = mockStore()({
  //     validation: {
  //       [AppScreens.HOME]: {
  //         test: {
  //           error: ["String is empty"], valid: false
  //         }
  //       }
  //     }
  //   })
  //   const wrapper = shallow(
  //     <InputWrapper
  //       name="test"
  //       validate={[validators.strlen, validators.phoneNumber]}
  //     />,
  //     { context: { store } }
  //   ).dive()
  //   expect(wrapper.find(TextField).length).toBe(1)
  //   expect(wrapper.find(View).length).toBe(3)
  //   wrapper.find(TextField).simulate(
  //     "endEditing",
  //     { nativeEvent: { text: "+447921873635" } }
  //   )
  //   expect(store.getActions()).toEqual([{
  //     type: VALIDATION_STATE_CHANGE,
  //     payload: {
  //       [AppScreens.HOME]: {
  //         test: { error: [], valid: true }
  //       }
  //     }
  //   }])
  // })

  // it("should not add new error to the list if such already exists (one validator)", () => {
  //   const store = mockStore()({
  //     validation: {
  //       [AppScreens.HOME]: {
  //         test: {
  //           error: ["String is empty"], valid: false
  //         }
  //       }
  //     }
  //   })
  //   const wrapper = shallow(
  //     <InputWrapper
  //       name="test"
  //       validate={validators.strlen}
  //     />,
  //     { context: { store } }
  //   ).dive()
  //   expect(wrapper.find(TextField).length).toBe(1)
  //   expect(wrapper.find(View).length).toBe(3)
  //   wrapper.find(TextField).simulate(
  //     "endEditing",
  //     { nativeEvent: { text: "" } }
  //   )
  //   expect(store.getActions()).toEqual([{
  //     type: VALIDATION_STATE_CHANGE,
  //     payload: {
  //       [AppScreens.HOME]: {
  //         test: {
  //           error: ["String is empty"], valid: false
  //         }
  //       }
  //     }
  //   }])
  // })

  // it("should not add new error to the list if such already exists (multiple validators)", () => {
  //   const store = mockStore()({
  //     validation: {
  //       [AppScreens.HOME]: {
  //         test: {
  //           error: ["String is empty"], valid: false
  //         }
  //       }
  //     }
  //   })
  //   const wrapper = shallow(
  //     <InputWrapper
  //       name="test"
  //       validate={[validators.strlen, validators.phoneNumber]}
  //     />,
  //     { context: { store } }
  //   ).dive()
  //   expect(wrapper.find(TextField).length).toBe(1)
  //   expect(wrapper.find(View).length).toBe(3)
  //   wrapper.find(TextField).simulate(
  //     "endEditing",
  //     { nativeEvent: { text: "" } }
  //   )
  //   expect(store.getActions()).toEqual([{
  //     type: VALIDATION_STATE_CHANGE,
  //     payload: {
  //       [AppScreens.HOME]: {
  //         test: {
  //           error: ["String is empty"], valid: false
  //         }
  //       }
  //     }
  //   }])
  // })

  // it("should not validate if no validator function provided", () => {
  //   const store = mockStore()({
  //     validation: {
  //       [AppScreens.HOME]: {
  //         test: {
  //           error: ["String is empty"], valid: false
  //         }
  //       }
  //     }
  //   })
  //   const wrapper = shallow(
  //     <InputWrapper name="test" />,
  //     { context: { store } }
  //   )
  //   expect(wrapper.dive().find(TextField).length).toBe(1)
  //   expect(wrapper.dive().find(View).length).toBe(0)
  //   wrapper.dive().find(TextField).simulate(
  //     "endEditing",
  //     { nativeEvent: { text: "" } }
  //   )
  //   expect(store.getActions()).toEqual([])
  // })

  it("should display validated field with popup", () => {
    const store = mockStore()({
      validation: {
        [AppScreens.HOME]: {
          test: {
            error: ["String is empty"], valid: false
          }
        }
      },
      kiosk: createKioskSettingsState()
    })
    const tree = renderer.create(
      <Provider store={store}>
        <InputWrapper
          name="test"
          popupText="popup"
          validate={validators.strlen}
          withPopup
        />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  // it("should display not validated field with popup", () => {
  //   const store = mockStore()({
  //     validation: {
  //       [AppScreens.HOME]: {
  //         test: {
  //           error: ["String is empty"], valid: false
  //         }
  //       }
  //     }
  //   })
  //   const wrapper = shallow(
  //     <InputWrapper
  //       name="test"
  //       popupText="popup"
  //       withPopup
  //     />,
  //     { context: { store } }
  //   ).dive()
  //   expect(wrapper.find(TextField).length).toBe(1)
  //   expect(wrapper.find(TouchableOpacity).length).toBe(1)
  //   expect(wrapper.find(Popup).length).toBe(1)
  //   expect(wrapper.find(Popup).prop("show")).toBeFalsy()
  //   wrapper.find(TouchableOpacity).simulate("press")
  //   expect(store.getActions()).toEqual([])
  //   expect(wrapper.find(Popup).prop("show")).toBeTruthy()
  // })

})
