import {
  hideScreenSaver,
  loadScreenSaverDataRequest,
  loadScreenSaverDataSuccess,
  loadScreenSaverDataFail
} from "../../src/actions/screenSaver"
import { SCREEN_SAVER, KIOSK } from "../../src/actions/types"

describe("The screen saver action creators", () => {

  describe("hideScreenSaver", () => {
    it("should return the correct action", () => {
      // When
      const action = hideScreenSaver()

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", SCREEN_SAVER.RESET)
    })
  })

  describe("loadScreenSaverDataRequest", () => {
    it("should return the correct action", () => {
      // When
      const action = loadScreenSaverDataRequest()

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.LOAD_SCREEN_SAVER_DATA.REQUEST)
    })
  })

  describe("loadScreenSaverDataSuccess", () => {
    it("should return the correct action", () => {
      // When
      const videoURL = "http://qudini.video"
      const screenSaverEnableInSeconds = 60
      const enableScreensaver = true
      const action = loadScreenSaverDataSuccess(videoURL, screenSaverEnableInSeconds, enableScreensaver)

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.LOAD_SCREEN_SAVER_DATA.SUCCESS)
      expect(action).toHaveProperty("payload", {
        enableScreensaver: true,
        screenSaverEnableInSeconds: 60,
        videoURL: "http://qudini.video"})
    })
  })

  describe("loadScreenSaverDataFail", () => {
    it("should return the correct action", () => {
      // When
      const error = {
        title: "title",
        message: "message"
      }
      const action = loadScreenSaverDataFail(error)

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.LOAD_SCREEN_SAVER_DATA.FAILURE)
      expect(action).toHaveProperty("payload")
    })
  })
})
