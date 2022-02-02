import React from "react"
import { Provider } from "react-redux"
import mockStore from "redux-mock-store"
import renderer from "react-test-renderer"
import Checkbox from "../../src/components/Checkbox"
import DatePicker from "../../src/components/DatePicker"
import Dropdown from "../../src/components/Dropdown"
import QuestionsScreen from "../../src/components/QuestionsScreen"
import { createState, createQuestion } from "../fixtures"

describe("QuestionsScreen component tests", () => {
  const mockFn = jest.fn().mockReturnValue(true)
  const goBackExtra = jest.fn
  const navigation = {
    addListener: jest.fn().mockReturnValue({ remove: jest.fn }),
    closeDrawer: jest.fn,
    dismiss: mockFn,
    dispatch: mockFn,
    getParam: jest.fn,
    goBack: mockFn,
    isFocused: mockFn,
    navigate: mockFn,
    openDrawer: jest.fn,
    pop: mockFn,
    popToTop: mockFn,
    push: mockFn,
    replace: mockFn,
    setParams: mockFn,
    state: {},
    toggleDrawer: jest.fn,
  }

  it("Should render QuestionsScreen component successfully (without content)", () => {
    const state = {
      ...createState(),
      answers: [],
      questions: {
        current: 0,
        questions: []
      },
    }
    const store = mockStore()(state)
    const tree = renderer.create(
      <Provider store={store}>
        <QuestionsScreen
          dispatch={store.dispatch}
          goBackExtra={goBackExtra}
          navigation={navigation}
        />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Should render checkbox question", () => {
    const state = {
      ...createState(),
      answers: [],
      questions: {
        current: 0,
        questions: [createQuestion("CHECK_BOX")]
      },
    }
    const store = mockStore()(state)
    const tree = renderer.create(
      <Provider store={store}>
        <QuestionsScreen
          dispatch={store.dispatch}
          goBackExtra={goBackExtra}
          navigation={navigation}
        />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Should render date (current) question successfully", () => {
    const state = {
      ...createState(),
      answers: [{
        questionId: 0,
        showOther: false,
        text: "2018-01-01T10:00:00.000Z"
      }],
      questions: {
        current: 1,
        questions: [
          createQuestion("CHECK_BOX"),
          createQuestion("DATE"),
          createQuestion("DROPDOWN"),
        ]
      },
    }
    const store = mockStore()(state)
    const tree = renderer.create(
      <Provider store={store}>
        <QuestionsScreen
          dispatch={store.dispatch}
          goBackExtra={goBackExtra}
          navigation={navigation}
        />
      </Provider>
    )
    expect(() => tree.root.findByType(Checkbox)).toThrow()
    expect(tree.root.findByType(DatePicker)).toBeDefined()
    expect(tree.toJSON()).toMatchSnapshot()
  })

  it("Should render dropdown (current) question successfully", () => {
    const state = {
      ...createState(),
      answers: [{ }],
      questions: {
        current: 2,
        questions: [
          createQuestion("CHECK_BOX"),
          createQuestion("DATE"),
          createQuestion("DROPDOWN"),
        ]
      },
    }
    const store = mockStore()(state)
    const tree = renderer.create(
      <Provider store={store}>
        <QuestionsScreen
          dispatch={store.dispatch}
          goBackExtra={goBackExtra}
          navigation={navigation}
        />
      </Provider>
    )
    expect(() => tree.root.findByType(DatePicker)).toThrow()
    expect(tree.root.findByType(Dropdown).props.data)
      .toMatchSnapshot()
    expect(tree.toJSON()).toMatchSnapshot()
  })

})
