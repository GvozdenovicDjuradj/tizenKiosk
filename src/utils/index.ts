import { fixUrl } from "./fixUrl"
import { getLocaleString } from "./localeString"
import { getRouteName } from "./getRouteName"
import * as selectors from "./selectors"
import flags from "./flags"
import validators from "./validators"
import { getTemplateBackground, getTemplateStyles } from "./templateStyles"
import AlertError from "./AlertError"
import { requestReadPhoneState } from "./requestPhoneStatePermission"
import * as metrics from "./metrics"

export {
  AlertError,
  fixUrl,
  flags,
  getLocaleString,
  getRouteName,
  getTemplateBackground,
  getTemplateStyles,
  selectors,
  validators,
  requestReadPhoneState,
  metrics
}
