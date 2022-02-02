import React, { ReactElement } from "react"
import { Button, Clipboard, ScrollView, Text } from "react-native"
import styled from "styled-components/native"

const Container = styled.View`
    height: 80%;
    width: 100%;
`

const Row = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
`

const Header = styled.Text`
    font-size: 22px;
    font-weight: bold;
    color: black;
`

const Output = styled.Text`
    font-size: 16px;
    line-height: 35px;
    color: black;
`

export interface Props {
    debugOutput: string[];
    notificationTitle: string;
    notificationMessage: string;
}

export default ({ debugOutput, notificationTitle, notificationMessage }: Props): ReactElement | null =>
    <Container>
        <Row>
            <Header>Printer Debug Output</Header>
            <Button title="COPY" onPress={() => { Clipboard.setString(debugOutput.toString()) }} />
        </Row>
        <ScrollView>
            <Text>
{`Last printer notification:\n
Title: ${notificationTitle}\n
Message: ${notificationMessage}\n
`}
            </Text>
            <Text selectable>
              {debugOutput.map((message) => <Output>{`${message}\n`}</Output>)}
            </Text>
        </ScrollView>
    </Container>
