import React from "react"
import ReactDOM from "react-dom"

const alertRoot =
  window &&
  window.document &&
  window.document.getElementById("alert-root")

export interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

export interface AlertOptions {
  cancelable?: boolean;
  onDismiss?: () => void;
}

export interface Props {
  buttons?: AlertButton[];
  message?: string;
  options?: AlertOptions;
  title: string;
  type?: string;
}

export interface State extends Props {
  show: boolean;
}

export default class Alert extends React.Component<Props, State> {

  public static _instance?: Alert
  public static alert(title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions, type?: string) {
    return Alert._instance
      ? Alert._instance.setState({ buttons, message, options, show: true, title, type })
      : null
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      show: false,
      title: "",
    }
  }

  public componentWillUnmount() {
    Alert._instance = undefined
  }

  public close = (fn?: AlertButton["onPress"]) => () => {
    if (fn) {
      fn()
    }
    this.setState((state) => ({ show: !state.show }))
  }

  public _render() {
    const { buttons = [], message, show, title } = this.state
    return show && title.trim() ? (
      <div className="alert">
        <div className="backdrop">
          <div className="content">
            <div className="title">{title}</div>
            <div className="message">{message}</div>
            <div className="buttons">
              {buttons.length ? (
                <button className="button" onClick={this.close(buttons[0].onPress)}>
                  <span className="text">{buttons[0].text}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ) : null
  }

  public render() {
    Alert._instance = this
    return alertRoot
      ? ReactDOM.createPortal(this._render(), alertRoot)
      : alertRoot
    }
}
