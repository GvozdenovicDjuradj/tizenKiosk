import React, {FC} from "react"
import {TextInputProps} from "react-native"
import {TextInputContainer} from "./styles"

const TextInput: FC<TextInputProps> = (props) => (
    <TextInputContainer>
        <TextInput {...props} />
    </TextInputContainer>
)

export default TextInput
