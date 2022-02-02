import React, {FC, useState} from "react"
import styled from "styled-components/native"
import {
    CountryCode, formatIncompletePhoneNumber,
    getExampleNumber, parseIncompletePhoneNumber,
    parsePhoneNumberFromString
} from "libphonenumber-js"
import examples from "libphonenumber-js/examples.mobile.json"
import {
    ImageRequireSource,
    NativeSyntheticEvent,
    Platform,
    TextInputChangeEventData, TextInputComponent,
    TextInputFocusEventData, TextInputSubmitEditingEventData
} from "react-native"
import PhoneNumberCountryCodePickerModal from "./PhoneNumberCountryCodePickerModal"
import flags from "../../utils/flags"
import {TextInput, TextInputContainer} from "./styles"
import Popup from "./Popup"
import {fonts} from "../../theme/fonts"

const unselectedCountryCodeIcon: ImageRequireSource = require("../../../assets/icons/world.png")

const Container = styled.KeyboardAvoidingView`
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const IconTouch = styled.TouchableOpacity`
    height: 32px;
    width: 32px;
    border-radius: ${32 / 2}px;
`

const CountryIcon = styled.Image`
    flex: 1;
    width: 32px;
    height: 32px;
    align-self: flex-start;
`

const InformationIcon = styled.Text`
    color: #dfdfdf;
    font-family: ${Platform.OS === "ios" ? "FontAwesome5FreeSolid" : "fontawesome-solid"};
    font-size: 26px;
    margin-left: 10px;
    text-align: center;
`

const InformationIconContainer = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    padding: 5px;
`

const ErrorText = styled.Text`
    margin-top: 5px;
    color: red;
    font-family: ${fonts.get("ubuntu")};
    font-size: 24px;
`

const getIconForCountryCode = (countryCode?: CountryCode): ImageRequireSource =>
    countryCode ? flags[countryCode.toLowerCase()] : unselectedCountryCodeIcon

const getPlaceholderForCountryCode = (countryCode?: string) => {
    if (!countryCode) {
        return undefined
    }

    const examplePhoneNumberForCountryCode = getExampleNumber(countryCode.toUpperCase() as CountryCode, examples)

    if (!examplePhoneNumberForCountryCode) {
        return undefined
    }

    return examplePhoneNumberForCountryCode.formatNational()
}

export interface PhoneNumberWithValidityStatus {
    value: string,
    isValid: boolean
}

export interface Props {
    readonly placeholder?: string;
    readonly popupMessage?: string;
    readonly displayRequiredMessage?: boolean;
    readonly displayInvalidMessage?: boolean;
    readonly defaultCountryCode?: CountryCode;
    readonly invalidErrorMessage?: string;
    readonly requiredErrorMessage?: string;
    readonly inputRef?: (instance: TextInputComponent | null) => void;
    readonly onChange?: (value: PhoneNumberWithValidityStatus) => void;
    readonly onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    readonly onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
}

const PhoneNumberTextInput: FC<Props> =
    ({ placeholder = "Enter a phone number...",
         popupMessage,
         displayRequiredMessage = false,
         displayInvalidMessage = false,
         defaultCountryCode,
         onChange,
         onBlur,
         inputRef,
         onSubmitEditing,
         invalidErrorMessage,
         requiredErrorMessage,}) => {
    const [examplePlaceholder, setExamplePlaceholder] =
        useState<string>(getPlaceholderForCountryCode(defaultCountryCode) || placeholder)
    const [input, setInput] = useState<undefined | string>(undefined)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedCountryCode, setSelectedCountryCode] = useState<undefined | CountryCode>(defaultCountryCode)
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)

    const onCountryCodeSelect = (countryCode: CountryCode) => {
        const example = getExampleNumber(countryCode.toUpperCase() as CountryCode, examples)
        setInput(undefined)
        setSelectedCountryCode(countryCode)
        setIsModalOpen(false)
        setExamplePlaceholder(example ? example.formatNational() : placeholder)

        if (onChange) {
            onChange({
                value: "",
                isValid: false
            })
        }
    }

    const onPhoneNumberInput = (phoneNumber: string) => {
        const newValue = parseIncompletePhoneNumber(phoneNumber)
        if (newValue === input &&
            formatIncompletePhoneNumber(newValue, selectedCountryCode).indexOf(phoneNumber) === 0) {
            setInput(newValue.slice(0, -1))
        } else {
            setInput(newValue)
        }

        const parsed = parsePhoneNumberFromString(phoneNumber, selectedCountryCode)

        if (onChange) {
            const phoneNumberWithValidityStatus = parsed && parsed.isValid() ? {
                value: parsed.formatInternational().replace(/ /g, ''),
                isValid: true
            } : {
                value: formatIncompletePhoneNumber(phoneNumber),
                isValid: false
            }

            onChange(phoneNumberWithValidityStatus)
        }

        if (!parsed || !parsed.country) {
            return
        }

        const countryCode = parsed.country.toUpperCase() as CountryCode
        const example = getExampleNumber(countryCode, examples)
        setSelectedCountryCode(countryCode)
        setExamplePlaceholder(example ? example.formatNational() : placeholder)
    }

    const onInformationPress = () => {
        setIsPopupOpen(!isPopupOpen)
    }

    const getFormattedNumber = () => {
        if (!input) {
            return undefined
        }

        return formatIncompletePhoneNumber(input, selectedCountryCode)
    }

    const getErrorText = () => {
        if (!input && displayRequiredMessage) {
            return requiredErrorMessage ||  "Please enter phone number"
        }

        if (input && displayInvalidMessage) {
            return invalidErrorMessage || "Please enter a valid phone number";
        }

        return ""
    }

    const errorText = getErrorText()

    return (
        <Container behavior={"padding"}>
            <PhoneNumberCountryCodePickerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={onCountryCodeSelect}
            />
            <TextInputContainer isValid={!getErrorText()}>
                <IconTouch onPress={() => setIsModalOpen(true)}>
                    <CountryIcon resizeMode={"contain"} source={getIconForCountryCode(selectedCountryCode)}/>
                </IconTouch>
                <TextInput
                    placeholder={examplePlaceholder}
                    keyboardType={"phone-pad"}
                    textContentType={"telephoneNumber"}
                    blurOnSubmit={true}
                    contextMenuHidden={true}
                    innerRef={inputRef}
                    value={getFormattedNumber()}
                    onBlur={onBlur}
                    onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) =>
                        onPhoneNumberInput(e.nativeEvent.text)}
                    onSubmitEditing={onSubmitEditing}
                />
                { !!popupMessage &&
                    <>
                        <InformationIconContainer onPress={onInformationPress}>
                            <InformationIcon>&#xf05a;</InformationIcon>
                        </InformationIconContainer>
                        <Popup message={popupMessage} isOpen={isPopupOpen} />
                    </>
                }
            </TextInputContainer>
            { !!errorText && <ErrorText>{errorText}</ErrorText> }
        </Container>
    )
}

export default PhoneNumberTextInput
