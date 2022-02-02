import reducer, { initialState } from "../../src/reducers/modal"
import { MODAL, OTHER_ACTION } from "../../src/actions/types"
import { ModalState } from "../../src/interfaces"

describe("modal reducer tests", () => {

  it("should set empty object as initial state", () => {
    expect(reducer({} as ModalState, { type: OTHER_ACTION })).not.toBe(initialState)
  })

  it("should set initial state", () => {
    expect(reducer(initialState, { type: OTHER_ACTION })).toEqual(initialState)
  })

  it("should show modal", () => {
    expect(reducer(initialState, {
      type: MODAL.SHOW.REQUEST,
      title: "test title",
      componentName: "test component"
    })).toEqual({
      componentName: "test component",
      title: "test title",
      visible: true,
    })
  })

  it("should hide modal", () => {
    expect(reducer(
      { ...initialState, title: "test title", componentName: "test component", visible: true },
      { type: MODAL.HIDE.REQUEST }
    )).toEqual(initialState)
  })

})