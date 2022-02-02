import React from "react"
import {
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import moment from "moment"
import "moment-duration-format"
import { connect } from "react-redux"
import { AnyProduct } from "../../interfaces/product"
import { mixins } from "../../theme"
import { RootState, KioskSettings } from "../../interfaces"
import { metrics } from "../../utils"
import { NavigationEvents } from "react-navigation"
import { getTranslatedProductName } from '../../utils/selectors'

export interface StateProps { 
  isDisabled: boolean
}

interface PropsFromState {
  serviceButtonColor: string;
  textColor: string;
  fontFamily: string;
  productName?: string;
  isLoading: boolean;
}

interface OwnProps {
  onProductPress: (product: AnyProduct) => any
  product: AnyProduct
  showWaitTime?: boolean;
  style?: any,
  textStyle?: any
  withIcon?: boolean
}

interface ServiceButtonProps extends PropsFromState, OwnProps { }

const buttonStyle: StyleProp<ViewStyle> = {
  alignItems: "center",
  elevation: 7,
  justifyContent: "center",
  margin: 15,
  padding: 15,
  shadowOffset: { width: 2, height: 5 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  width: "30%",
  ...mixins.borderRadius(6),
}

const iconText = {
  fontFamily: Platform.OS === "ios" ? "FontAwesome5FreeSolid" : "fontawesome-solid",
}

const viewStyle: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
}

const textStyle: TextStyle = {
  fontSize: 24,
  textAlign: "center",
}
/**
 * Returns string in format `{days} d {hours} h {minutes} min`
 * @param time time to parse in minutes
 */
const formatTime = (time = 0): string => moment
  .duration(time, "minutes")
  .format("d [d] h [h] m [min]", { trim: "both" })

class ProductButton extends React.Component<ServiceButtonProps, StateProps> {
  public state = {
    isDisabled: false
  }

  UNSAFE_componentWillReceiveProps(nextProps: ServiceButtonProps) {
    // In case there's an error `isLoading` is going to be set to false and we want to enable the button again
    if (!nextProps.isLoading) {
      this.setState({isDisabled: false});
    }
  }

  public render() {
    const {
      onProductPress,
      product,
      serviceButtonColor,
      showWaitTime = false,
      style,
      textColor,
      fontFamily,
      withIcon = false,
      productName,
      isLoading,
    } = this.props
    const buttonStyles = [
      buttonStyle,
      style,
      { height: metrics.minSize(150, metrics.vh(18))},
      { backgroundColor: serviceButtonColor, shadowColor: "#000" },
    ];

    return (
      <React.Fragment>
        <NavigationEvents
          onWillFocus={this.disableHandler(false)}
          onWillBlur={this.disableHandler(true)}
        />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => { 
              this.setState({isDisabled: true});  
              onProductPress(product); 
          }}
          style={buttonStyles}
          disabled={this.state.isDisabled || isLoading}
        >
          <View style={viewStyle}>
            {withIcon ? (
              <View style={{ paddingHorizontal: 10 }}>
                <Text style={[iconText, { color: textColor }]}>&#xf019;</Text>
              </View>
            ) : null}
            <Text numberOfLines={2} style={[textStyle, { color: textColor, fontFamily }]}>
              {productName}
            </Text>
          </View>
          {showWaitTime ? (
            <View style={viewStyle}>
              <Text style={[textStyle, { color: textColor, fontSize: 18, fontFamily }]}>
                Wait time: {formatTime(product.waitTime)}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </React.Fragment>
    )
  }

  private readonly disableHandler = (isDisabled: boolean) => () => {
    this.setState({
      isDisabled
    })
  }
}

const mapStateToProps = (state: RootState, props: OwnProps) => {
  const settings = state.kiosk.settings as KioskSettings
  return {
    serviceButtonColor: settings && settings.template.serviceButtonColor || "#000",
    textColor: settings && settings.template.buttonTextColor || "#fff",
    fontFamily: settings && settings.template.font || "Arial",
    productName: getTranslatedProductName(state, props.product),
    isLoading: state.kiosk.isAddingCustomerToQueue,
  }
}

export default connect(mapStateToProps)(ProductButton)
