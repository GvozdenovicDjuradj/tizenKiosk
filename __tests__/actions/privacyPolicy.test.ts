import {
  loadPrivacyPolicyDataRequest,
  agreePrivacyPolicy,
  disagreePrivacyPolicy,
  loadPrivacyPolicyDataSuccess
} from "../../src/actions/"
import { KIOSK } from "../../src/actions/types"
import { PRIVACY_POLICY_AGREE, PRIVACY_POLICY_DISAGREE } from "../../src/actions/types"
import { createPrivacyPolicy } from "../fixtures"

describe("The privacy policy action creators", () => {

  describe("loadPrivacyPolicyDataRequest", () => {
    it("should return the correct action", () => {
      // When
      const action = loadPrivacyPolicyDataRequest()

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.LOAD_PRIVACY_POLICY_DATA.REQUEST)
    })
  })

  describe("agreePrivacyPolicy", () => {
    it("should return the correct action", () => {
      // When
      const action = agreePrivacyPolicy()

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", PRIVACY_POLICY_AGREE)
    })
  })

  describe("disagreePrivacyPolicy", () => {
    it("should return the correct action", () => {
      // When
      const action = disagreePrivacyPolicy()

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", PRIVACY_POLICY_DISAGREE)
    })
  })

  describe("loadPrivacyPolicyDataSuccess", () => {
    it("should return the correct action", () => {
      // When
      const payload = createPrivacyPolicy()
      const action = loadPrivacyPolicyDataSuccess(payload, true)

      // Then
      expect(action).not.toBeNull()
      expect(action).toHaveProperty("type", KIOSK.LOAD_PRIVACY_POLICY_DATA.SUCCESS)
      expect(action).toHaveProperty("payload", { ...payload })
    })
  })
})
