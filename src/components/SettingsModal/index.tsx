import React from "react"
import {
  BackHandler,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { connect } from "react-redux"
import DeviceInfo from "react-native-device-info"
import { DeviceInfoContainer } from "./deviceInfo"
import TextField from "../TextField"
import Button from "../Button"
import styles from "./styles"
import { FieldUpdatePayload, RegisterKioskFields, RootState } from "../../interfaces"
import { KioskSettingsForm } from "../../reducers/kioskSettings"
import {
  checkNetwork as checkNetworkStatus,
  deactivateApp,
  saveKioskSettingsChanges,
  updateSettingsField,
  validateKioskSettings,
  getPermissionReadPhoneState
} from "../../actions"
import { selectors, validators } from "../../utils"
import { colors } from "../../theme"
import {isPlatformAndroidOrIos} from "../../utils/Platform"
import PrinterConfiguration from "../../printer/containers/PrinterConfiguration"
import DebugOutput from "../../printer/containers/DebugOutput"

export interface SettingsModalProps {
  canSaveChanges: boolean
  canValidateSettings: boolean
  checkNetwork: () => void
  deactivate: () => void
  dismiss: () => void
  form: KioskSettingsForm
  saveChanges: () => void
  updateField: (payload: FieldUpdatePayload) => void
  validateSettings: () => void,
  deviceImei?: string | null,
  getPhoneStatePermission: () => void,
  isDebugOutputVisible: boolean,
}

interface SettingsModalState {
  deactivate: boolean
}

export class SettingsModal extends React.PureComponent<SettingsModalProps, SettingsModalState> {

  public state = { deactivate: false }

  public componentDidMount() {
    this.props.getPhoneStatePermission()
  }

  public render() {
    const {
      canSaveChanges,
      canValidateSettings,
      checkNetwork,
      deactivate,
      dismiss,
      form,
      updateField,
      validateSettings,
      deviceImei,
      isDebugOutputVisible
    } = this.props
    const deactivateBtnText = this.state.deactivate
      ? "Cancel deactivation"
      : "Deactivate Kiosk"
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Kiosk Settings
          </Text>
          <TouchableOpacity onPress={dismiss}>
            <Text style={styles.fa}>&#xf00d;</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentWrapper}>
          <View>
            <View style={{ width: "100%", marginBottom: 10 }}>
              <View>
                <Text style={styles.textStyles}>URL</Text>
              </View>
              <View>
                <TextField
                  name="newKioskUrl"
                  onChangeText={(value: string) => updateField({
                    name: RegisterKioskFields.url,
                    value
                  })}
                  placeholder={"kiosk URL"}
                  style={styles.inputStyles}
                  validate={__DEV__
                    ? validators.strlen
                    : [validators.strlen, validators.qudiniUrl]
                  }
                  value={form.url}
                />
              </View>
            </View>
            <View style={{ width: "100%", marginBottom: 10 }}>
              <View>
                <Text style={styles.textStyles}>Kiosk ID</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TextField
                  name="kioskId"
                  onChangeText={(value: string) => updateField({
                    name: RegisterKioskFields.kioskIdentifier,
                    value
                  })}
                  placeholder={"kiosk ID"}
                  style={styles.inputStyles}
                  value={form.kioskIdentifier}
                />
              </View>
            </View>
            { isPlatformAndroidOrIos() &&
              <View style={[styles.row, { marginBottom: 10 }]}>
                <View>
                  <Text style={[styles.textStyles, { fontSize: 20 }]}>
                    Kiosk Mode
                  </Text>
                </View>
                <Switch
                    value={form.hasKioskModeEnable}
                    onValueChange={(value) => updateField({
                      name: RegisterKioskFields.hasKioskModeEnable,
                      value
                    })}
                />
              </View>
            }
          </View>
          { isPlatformAndroidOrIos() &&
            <View style={{ marginBottom: 10 }}>
              <PrinterConfiguration />
              { isDebugOutputVisible && <DebugOutput /> }
            </View>
          }
          <DeviceInfoContainer
              uniqueId={DeviceInfo.getUniqueID()}
              version={DeviceInfo.getReadableVersion()}
              deviceImei={deviceImei}
          />
          <View style={[styles.row, { marginBottom: 10 }]}>
            <Button
              disabled={!canValidateSettings}
              onPress={validateSettings}
              style={[styles.button, canValidateSettings ? {} : { opacity: 0.7 }]}
              text={"Validate Settings"}
              textColor={colors.text}
            />
            <Button
              text={"Check Network"}
              onPress={checkNetwork}
              style={styles.button}
              textColor={colors.text}
            />
            <Button
              text={deactivateBtnText}
              style={styles.button}
              onPress={this.toggleDeactivate}
              textColor={colors.text}
            />
          </View>
          {this.state.deactivate ? (
            <View style={[styles.row, styles.deactivateWarningView]}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14 }}>
                  Deactivating will clear this app so that it will need repairing
                </Text>
              </View>
              <TouchableOpacity onPress={deactivate} style={styles.deactivateBtn}>
                <Text style={styles.deactivateBtnText}>
                  Confirm deactivation
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={{ flex: 1, marginBottom: 10 }}>
            <ScrollView style={styles.messagesView}>
              {form.diagnosticMessages.length
                ? form.diagnosticMessages.map((msg, idx) =>
                  <Text style={styles.textStyles} key={`diagnostic_${idx}`}>
                    {msg}
                  </Text>
                )
                : (
                  <Text style={{ opacity: 0.7 }}>
                    This is where network or validation messaging would appear
                  </Text>
                )
              }
            </ScrollView>
          </View>
          <View style={styles.bottomRow}>
            <Button
              disabled={!canSaveChanges}
              style={[styles.button, canSaveChanges ? {} : { opacity: 0.7 }]}
              text={"Save Settings"}
              textColor={colors.text}
            />
            <Button
              onPress={BackHandler.exitApp}
              style={styles.button}
              text={"Minimize app"}
              textColor={colors.text}
            />
          </View>
        </ScrollView>
      </View>
    )
  }

  private readonly toggleDeactivate = () =>
    this.setState({ deactivate: !this.state.deactivate })

}

const mapStateToProps = (state: RootState) => ({
  canSaveChanges: selectors.canSaveChanges(state),
  canValidateSettings: selectors.canValidateSettings(state),
  form: state.kioskSettings,
  deviceImei: state.app.deviceImei,
  isDebugOutputVisible: state.printer.isDebugOutputVisible
})

const mapDispatchToProps = {
  checkNetwork: checkNetworkStatus,
  deactivate: deactivateApp,
  saveChanges: saveKioskSettingsChanges,
  updateField: updateSettingsField,
  validateSettings: validateKioskSettings,
  getPhoneStatePermission: getPermissionReadPhoneState
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)
