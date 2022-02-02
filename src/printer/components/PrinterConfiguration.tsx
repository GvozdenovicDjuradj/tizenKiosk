import {Printer} from "@dnlowman/react-native-star-prnt"
import React from "react";
import { FlatList, Switch } from "react-native"
import styled from "styled-components/native";
import { fonts } from "../../theme/fonts"
import PrinterListItem from "./PrinterListItem"

const Text = styled.Text`
    font-family: ${fonts.get("ubuntu")};
    font-size: 20px;
    color: black;
`;

const Container = styled.View`
    display: flex;
    width: 100%;
    margin-top: 10px;
`;

const Header = styled.View`
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
`;

const ListContainer = styled.View`
    border-color: #e6e6e6;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    margin-bottom: 10px;
`;

const PrinterList = styled(FlatList)`
    height: 100px;
`

const ButtonsContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const Button = styled.Button`
    width: 100%;
    height: 40px;
    color: black;
    elevation: 0;
`;

export interface Props {
    availablePrinters: Printer[];
    searchForPrinters: () => void;
    selectedPrinter?: Printer;
    isFindingPrinters: boolean;
    isPrinterEnabled: boolean;
    isPendingPrint: boolean;
    selectPrinter: (printer: Printer) => void;
    setPrinterEnabled: (enabled: boolean) => void;
    printTicket: () => void;
    toggleDebugOutput: () => void;
    isDebugOutputVisible: boolean;
};

export default ({ availablePrinters,
                    searchForPrinters,
                    selectedPrinter,
                    selectPrinter,
                    isPrinterEnabled,
                    isPendingPrint,
                    isFindingPrinters,
                    setPrinterEnabled,
                    printTicket,
                    toggleDebugOutput,
                    isDebugOutputVisible}: Props) =>
    <Container>
        <Header>
            <Text>CONNECT PRINTER</Text>
            <Switch value={isPrinterEnabled} onValueChange={setPrinterEnabled} />
        </Header>
        { isPrinterEnabled &&
            <>
                <ListContainer>
                    <PrinterList
                      refreshing={isFindingPrinters}
                      onRefresh={searchForPrinters}
                      data={availablePrinters}
                      ListEmptyComponent={() => !isFindingPrinters ? <Text>Could not find any printers</Text> : null}
                      keyExtractor={(item, index) => (item as Printer).portName ?? index.toString()}
                      renderItem={({item, index}) =>
                        <PrinterListItem
                          name={(item as Printer).modelName ?? "Unknown"}
                          onPress={() => selectPrinter(item as Printer)}
                          isEven={index % 2 === 0}
                          isSelected={selectedPrinter?.portName === (item as Printer).portName}
                        />
                      }/>
                </ListContainer>
                <ButtonsContainer>
                    <Button disabled={isFindingPrinters}
                            title={"Search for Printers"}
                            onPress={searchForPrinters} />
                    <Button disabled={!selectedPrinter || isFindingPrinters || isPendingPrint}
                            title={"Test Printer"}
                            onPress={printTicket} />
                    <Button title={"Output"}
                            color={isDebugOutputVisible ? "red" : undefined}
                            onPress={toggleDebugOutput} />
                </ButtonsContainer>
            </>
        }
    </Container>
