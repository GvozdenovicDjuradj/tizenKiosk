import React, {FC} from "react"
import styled from "styled-components/native"
import {fonts} from "../../theme/fonts"
import icons from "../../icons"

const Container = styled.View`
    position: absolute;
    top: 230px;
    left: 10px;
    height: 46px;
    width: 200px;
    display: flex;
    flex-direction: row;
`

const IconContainer = styled.View`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    width: 56px;
    background-color: #F8ECEC;
    border-radius: 43px;
    margin-right: 6px;
`

const MessageContainer = styled.View`
    display: flex;
    flex-direction: column;
    min-height: 56px;
    background-color: #F8ECEC;
    border-radius: 43px;
    justify-content: center;
    min-width: 180px;
    padding: 20px;
`

const Title = styled.Text`
    font-family: ${fonts.get("ubuntuBold")};
    font-size: 12px;
    color: #495057;
    line-height: 16px;
`

const Message = styled.Text`
    font-family: ${fonts.get("ubuntuBold")};
    font-size: 12px;
    color: #6f7780;
    line-height: 16px;
`

const Icon = styled.Image`
    height: 23px;
`

export interface Props {
    title: string;
    message: string;
}

const Notification: FC<Props> = ({ title, message }) =>
    <Container>
        <IconContainer>
            <Icon source={icons.paper} resizeMode={"contain"} />
        </IconContainer>
        <MessageContainer>
            <Title>
                {title}
            </Title>
            <Message>
                {message}
            </Message>
        </MessageContainer>
    </Container>

export default Notification
