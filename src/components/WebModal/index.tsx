import React from "react"

export interface ModalProps {
  /**
   * The `animationType` prop controls how the modal animates.
   *
   * - `slide` slides in from the bottom
   * - `fade` fades into view
   * - `none` appears without an animation
   */
  animationType?: "none" | "slide" | "fade";
  /**
   * The `transparent` prop determines whether your modal will fill the entire view.
   * Setting this to `true` will render the modal over a transparent background.
   */
  transparent?: boolean;
  /**
   * The `visible` prop determines whether your modal is visible.
   */
  visible?: boolean;
  /**
   * The `onRequestClose` prop allows passing a function that will be called once the modal has been dismissed.
   * _On the Android platform, this is a required function._
   */
  onRequestClose?: () => void;
  /**
   * The `onShow` prop allows passing a function that will be called once the modal has been shown.
   */
  onShow?: (event: React.SyntheticEvent<any>) => void;
}

export default class Modal extends React.Component<ModalProps> {
  public render() {
    const { visible } = this.props
    const display = visible ? { display: "block" } : { display: "none" }
    const position: React.CSSProperties = {
      bottom: 0,
      left: 0,
      position: "fixed",
      right: 0,
      top: 0,
      zIndex: 1,
    }
    const modalStyle = { ...display, ...position }
    return (
      <div style={modalStyle}>
        {this.props.children}
      </div>
    )
  }
}
