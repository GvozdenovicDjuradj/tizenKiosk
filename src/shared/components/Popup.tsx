import React, {useState, FC} from "react"
import styled from "styled-components/native"
import {fonts} from "../../theme/fonts"
import {Animated} from "react-native"

const Container = styled(Animated.View)`
    position: absolute;
    width: 105%;
    background-color: black;
    padding-left: 20px;
    padding-right: 20px;
    bottom: 50px;
    left: -1px;
`

const Information = styled.Text`
    font-family: ${fonts.get("ubuntu")};
    font-size: 20px;
    text-align: center;
    color: white;
`

export interface Props {
    message: string
    isOpen: boolean
}

const Popup: FC<Props> = ({ message, isOpen }) => {
    const [fadeAnim] = useState<Animated.Value>(new Animated.Value(isOpen ? 1 : 0))

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: isOpen ? 1 : 0,
                duration: 500,
            }
        ).start()
    }, [isOpen])

    return (
        <Container style={{ opacity: fadeAnim }} pointerEvents="none" >
            <Information>{message}</Information>
        </Container>
    )
}

export default Popup
