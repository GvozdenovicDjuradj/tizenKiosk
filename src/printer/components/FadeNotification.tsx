import React, { FC } from "react"
import Fade from "../../shared/components/Fade"
import { default as PrinterNotification } from "./Notification"

export interface Props {
    isVisible: boolean;
    title: string;
    message: string;
}

const FadeNotification: FC<Props> = ({ isVisible, title, message }) =>
    <Fade visible={isVisible} style={{ position: "absolute" }}>
        <PrinterNotification title={title} message={message} />
    </Fade>

export default FadeNotification
