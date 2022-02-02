import React, { Component } from "react"
import { View } from "react-native"
import { captureRef, releaseCapture } from "react-native-view-shot"
import { PrintCommand, Printer, StarPRNT } from "@dnlowman/react-native-star-prnt"
import NipponPrinter from "../../NipponPrinter"
import styled from "styled-components/native"
import { searchModelInfoByModelName } from "../utils"
import { getFriendlyMessageForStatus, NipponStatus } from "../nipponStatus"

interface ModelNameProps {
    modelName?: string
}

const getBackgroundColorBasedOnModelName = ({ modelName }: ModelNameProps) =>
    modelName === "Nippon" ? "white" : "transparent"

const ViewShotView = styled.View`
    overflow: hidden;
    position: absolute;
    background-color: ${getBackgroundColorBasedOnModelName};
`

const Container = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
    background-color: ${getBackgroundColorBasedOnModelName};
`

const DateTimeContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 100px;
    background-color: ${getBackgroundColorBasedOnModelName};
`

const Logo = styled.Image`
    width: 300px;
    height: 100px;
    margin-bottom: 20px;
`

const FooterLogo = styled.Image`
    width: 300px;
    height: 100px;
    margin-top: 100px;
`

const ShowAtTop = styled.Text`
    font-size: 62px;
    text-align: center;
    margin-bottom: 20px;
    color: black;
`

const Message = styled.Text`
    font-size: 42px;
    text-align: center;
    width: 600px;
    margin-bottom: 50px;
    color: black;
`

const DateTime = styled.Text`
    font-size: 22px;
    color: black;
`

interface TicketProps extends Printer {
    logoUrl: string;
    ticketMessage: string;
    showAtTopValue: string;
    localCurrentTime: string;
    localCurrentDate: string;
    logoFooterUrl: string;
    isPendingPrint: boolean;
    ticketPrinted: () => void;
    printTicketRejected: () => void;
    isCurrentPrintATest: boolean;
    appendPrinterDebugOutput: (message: string) => void;
    displayPrinterNotification: (title: string, message: string) => void;
    hidePrinterNotification: () => void;
    setDebugOutput: (value: boolean) => void;
}

interface TicketState {
    logoHasLoaded: boolean;
    footerLogoHasLoaded: boolean;
    isPrintInProgress: boolean;
}

const CAPTURE_REF_FORMAT = "png"

export default class Ticket extends Component<TicketProps, TicketState> {
    public state = {
        logoHasLoaded: false,
        footerLogoHasLoaded: false,
        isPrintInProgress: false
    }

    private readonly viewShotRef = React.createRef<View>()

    public componentDidUpdate(prevProps: TicketProps): void {
        if (this.canProcessPrint(prevProps)) {
            this.printTicket()
        }
    }

    public render() {
        return (
            <ViewShotView ref={this.viewShotRef} modelName={this.props.modelName}>
                <Container modelName={this.props.modelName}>
                    { this.props.logoUrl !== "" &&
                        <Logo source={{uri: this.props.logoUrl}}
                              onLoadStart={this.onLogoLoadStart}
                              onLoadEnd={this.onLogoLoadEnd}
                              resizeMode="contain"
                        />
                    }
                    <ShowAtTop>
                        {this.props.showAtTopValue}
                    </ShowAtTop>
                    <Message>
                        {this.props.ticketMessage}
                    </Message>
                    { this.props.logoFooterUrl !== "" &&
                        <FooterLogo source={{uri: this.props.logoFooterUrl}}
                                    onLoadStart={this.onFooterLogoLoadStart}
                                    onLoadEnd={this.onFooterLogoLoadEnd}
                                    resizeMode="contain"
                        />
                    }
                </Container>
                <DateTimeContainer modelName={this.props.modelName}>
                    <DateTime>{this.props.localCurrentTime}</DateTime>
                    <DateTime>{this.props.localCurrentDate}</DateTime>
                </DateTimeContainer>
            </ViewShotView>
        )
    }

    private readonly setDebugOutputIfTestPrint = () => {
        if (this.props.isCurrentPrintATest) {
            this.props.setDebugOutput(true)
        }
    }

    private readonly printTicket = () => {
        requestAnimationFrame(() => {
            setTimeout(async () => {
                if (!(this.viewShotRef && this.viewShotRef.current)) {
                    return
                }

                this.props.appendPrinterDebugOutput("Starting print...")

                try {
                    const uri = await captureRef(this.viewShotRef.current, {format: CAPTURE_REF_FORMAT})

                    this.props.appendPrinterDebugOutput(`The ticket has been stored on disk: ${uri}`)

                    if (this.props.modelName === "Nippon") {
                        await NipponPrinter.printImage(this.props.portName, uri)
                        this.releaseAndUpdatePrintedState(uri)
                        this.props.appendPrinterDebugOutput(`The ticket has successfully been printed!`)

                        const status = await NipponPrinter.getPrinterStatus(this.props.portName)

                        if (status === NipponStatus.SUCCESS) {
                            this.props.hidePrinterNotification()
                        } else {
                            this.props.displayPrinterNotification("Printer", getFriendlyMessageForStatus(status))
                        }

                        return
                    } else if (this.props.modelName) {
                        const modelInfo = searchModelInfoByModelName(this.props.modelName)

                        if (!modelInfo) {
                            this.setDebugOutputIfTestPrint()
                            this.props.printTicketRejected()
                            this.props.appendPrinterDebugOutput(`The ticket has failed to print due to no modelInfo!`)
                            return
                        }

                        const commands: PrintCommand[] = []
                        if (modelInfo.emulation != null && this.props.portName != null) {
                            this.props.appendPrinterDebugOutput(`
emulation: ${modelInfo.emulation}
defaultPaperWidth: ${modelInfo.defaultPaperWidth}
portName: ${this.props.portName}
`)
                            commands.push({appendBitmap: uri, width: modelInfo.defaultPaperWidth})
                            commands.push({appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed})
                            await StarPRNT.print(modelInfo.emulation, commands, this.props.portName)
                            this.releaseAndUpdatePrintedState(uri)
                            this.props.appendPrinterDebugOutput(`The ticket has successfully been printed!`)
                            return
                        }

                        this.setDebugOutputIfTestPrint()
                        this.props.appendPrinterDebugOutput(`
Failed to print the ticket due to the emulation or portName being null
                        `)
                        this.props.printTicketRejected()
                        this.releaseAndUpdatePrintedState(uri)
                    }
                } catch (e) {
                    this.setDebugOutputIfTestPrint()
                    this.props.appendPrinterDebugOutput(`The ticket has failed to print!`)
                    this.props.printTicketRejected()
                    this.props.ticketPrinted()
                    this.setState({
                        isPrintInProgress: false
                    })
                }
            }, 500)
        })
    }

    private readonly releaseAndUpdatePrintedState = (uri: string): void => {
        releaseCapture(uri)
        this.props.ticketPrinted()
        this.setState({
            isPrintInProgress: false
        })
    }

    /**
     * Returns whether a print operation is pending along with
     * if the printer can currently take requests.
     *
     * @remarks
     * This method will perform a complex boolean check against the props & state of this component as to whether a
     * print operation should be sent to the connected printer.
     *
     * As there can only ever be one print operation at a time I track this using internal state (isPrintInProgress),
     * when a new print operation has been requested this will be injected into the component
     * as a form of prop (isPendingPrint).
     *
     * In addition to managing the current requests to the printer I also have to manage the rendered status of the
     * customisable images, these get resolved from the Qudini service which involves an implicit network request,
     * using the onLoadStart and onLoadEnd callbacks I track the loaded state of these logos within
     * (logoHasLoaded and footerLogoHasLoaded).
     *
     * I also perform an additional check comparing the previous props with the current props to fully determine that
     * the images have been flushed to the platforms UI layer indicating that I can take a snapshot of the UI elements.
     *
     * @returns
     */
    private readonly canProcessPrint = (prevProps: TicketProps): boolean =>
        !this.state.isPrintInProgress &&
        this.props.isPendingPrint &&
        this.state.logoHasLoaded &&
        this.props.logoUrl === prevProps.logoUrl &&
            (this.props.logoFooterUrl === "" ||
                (this.state.footerLogoHasLoaded && this.props.logoFooterUrl === prevProps.logoFooterUrl))

    private readonly onLogoLoadStart = () => {
        this.setState({
            logoHasLoaded: false
        })
    }

    private readonly onLogoLoadEnd = () => {
        this.setState({
            logoHasLoaded: true
        })
    }

    private readonly onFooterLogoLoadStart = () => {
        this.setState({
            footerLogoHasLoaded: false
        })
    }

    private readonly onFooterLogoLoadEnd = () => {
        this.setState({
            footerLogoHasLoaded: true
        })
    }
}
