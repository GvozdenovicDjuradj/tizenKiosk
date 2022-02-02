import React, { Component } from "react"
import {
  FlatList,
  Image,
  ImageStyle,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Actions, registerKiosk, registerKioskFieldUpdate } from "../../actions"
import { AppScreens, RegisterKioskFields, RootState } from "../../interfaces"
import TextField from "../TextField"
import ListItem, { RegistrationStepItem } from "./ListItem"
import { validators } from "../../utils"
import { content as styles, font } from "./styles"
import { isPlatformAndroidOrIos } from "../../utils/Platform"
import PrinterConfiguration from "../../printer/containers/PrinterConfiguration"
import DebugOutput from "../../printer/containers/DebugOutput"

const steps: RegistrationStepItem[] = [{
  key: "1",
  title: "Login to app.qudini.com with a merchant or venue admin account",
}, {
  key: "2",
  title: "Click ‘Settings’ then ‘Kiosk’",
}, {
  children: [{
    key: "3.1",
    title: "Kiosk description (just for your reference as to the location of the kiosk)",
  }, {
    key: "3.2",
    title: "Select a kiosk design template (defined by your merchant admin)",
  }, {
    key: "3.3",
    title: "Select the products to be used for this kiosk",
  }],
  key: "3",
  title: "Add a kiosk and set the following:",
}, {
  key: "4",
  title: "Press save. This then generates a kiosk ID to be used in step 2.",
}]

interface PropsFromState {
  kioskId: string;
  printerIp: string;
  qudiniUrl: string;
  showPrint: boolean;
  urlValid: boolean;
  isDebugOutputVisible: boolean;
}

interface PropsFromDispatch {
  fieldUpdate: (name: RegisterKioskFields, value: any) => Actions;
  registerKiosk: (showPrint: boolean) => Actions;
}

interface Props extends PropsFromState, PropsFromDispatch {
}

class Content extends Component<Props> {

  private kioskIdInput?: TextInput

  private printerUrlInput?: TextInput

  public render() {
    const {
      fieldUpdate,
      kioskId,
      qudiniUrl,
      showPrint,
      urlValid,
      isDebugOutputVisible
    } = this.props

    return (
      <View style={[styles.wrapper]}>
        <View style={styles.left}>
          { isDebugOutputVisible
            ? <DebugOutput />
            : <>
                <View style={styles.row}>
                  <View style={styles.stepNumberView}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepDescriptionView}>
                    <Text style={font}>Add a kiosk to your venue</Text>
                  </View>
                </View>
                <FlatList
                  data={steps}
                  renderItem={this.renderItem}
                />
            </>
          }
          <View style={styles.logoView}>
            <Image
              source={require("../../../assets/images/logo-qudini.png")}
              style={styles.logo as ImageStyle}
            />
          </View>
        </View>
        <View style={styles.right}>
          <View style={styles.row}>
            <View style={styles.stepNumberView}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepDescriptionView}>
              <Text style={[font, { paddingLeft: 15 }]}>Register your Kiosk</Text>
            </View>
          </View>
          <TextField
            testID="url"
            autoCorrect={false}
            name="url"
            onChangeText={(text: string) => fieldUpdate(RegisterKioskFields.url, text)}
            onSubmitEditing={() => {
              if (this.kioskIdInput) {
                this.kioskIdInput.focus()
              }
            }}
            placeholder="URL"
            returnKeyType="next"
            value={qudiniUrl}
            validate={__DEV__
                ? validators.strlen
                : [validators.strlen, validators.qudiniUrl]
            }
          />
          <TextField
              testID="kioskIdentifier"
              autoCorrect={false}
              name="kioskIdentifier"
              onChangeText={(text: string) => fieldUpdate(RegisterKioskFields.kioskIdentifier, text)}
              onSubmitEditing={() => {
                if (!showPrint) {
                  this.submit()
                } else if (this.printerUrlInput) {
                  this.printerUrlInput.focus()
                }
              }}
              placeholder="Kiosk ID"
              inputRef={(input: any) => {
                this.kioskIdInput = input
              }}
              returnKeyType={showPrint ? "next" : "done"}
              style={{flex: 0, marginTop: 15}}
              value={kioskId}
          />
          { isPlatformAndroidOrIos() && <PrinterConfiguration /> }
          <TouchableOpacity
            testID="save"
            onPress={this.submit}
            disabled={!urlValid}
            style={styles.saveSettingsBtn}
          >
            <Text style={styles.saveSettingsBtnText}>Save settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  private renderItem = ({ item }: { item: object }) => (
    <ListItem item={item as RegistrationStepItem} />
  )

  private submit = () => {
    if (this.props.urlValid) {
      this.props.registerKiosk(this.props.showPrint)
    }
  }
}

const mapStateToProps = (state: RootState) => ({
    kioskId: state.kiosk.fields.kioskIdentifier,
    printerIp: state.kiosk.fields.printerUrl,
    qudiniUrl: state.kiosk.fields.url,
    showPrint: state.kiosk.fields.hasPrinter,
    urlValid: state.validation[AppScreens.HOME] && state.validation[AppScreens.HOME].url.error.length < 1,
    isDebugOutputVisible: state.printer.isDebugOutputVisible
})

const mapDispatchToProps = (dispatch: Dispatch<Actions>): PropsFromDispatch => ({
  fieldUpdate: (name, value) => dispatch(registerKioskFieldUpdate({ name, value })),
  registerKiosk: (showPrint) => dispatch(registerKiosk(showPrint)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
