import React, { Component } from "react"
import { View, WebView, WebViewUriSource } from "react-native"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { setPrinterCallback, PrintingAction } from "../../actions/printing"
import { RootState } from "../../interfaces"

interface PrinterProps {
    callback: ((data: string) => void) | null
    setPrinterCallback: (callback: (data: string) => void) => PrintingAction
}

class Printer extends Component<PrinterProps> {
    private readonly localWebURL: WebViewUriSource
    private webViewRef: WebView | null = null
    private readonly setWebViewRef: (element: WebView) => void

    constructor(props: PrinterProps) {
        super(props)
        this.localWebURL = require("../../../widgets/printer/index.html")
        this.setWebViewRef = (element) => {
            this.webViewRef = element
        }
    }

    public componentDidMount() {
        if (this.webViewRef !== null) {
            this.props.setPrinterCallback(this.webViewRef.postMessage)
        }
    }

    public render() {
        return (
            <View style={{ zIndex: -1, position: "absolute" }}>
                <WebView
                    javaScriptEnabled={true}
                    originWhitelist={["*"]}
                    ref={this.setWebViewRef}
                    source={this.localWebURL}
                    style={{ zIndex: -2, opacity: 0 }}
                />
            </View>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    callback: state.printing.callback
})

const mapDispatchToProps = (dispatch: Dispatch<PrintingAction>) => ({
    setPrinterCallback: (callback: (data: string) => void) => (
        dispatch(setPrinterCallback(callback))
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(Printer)
