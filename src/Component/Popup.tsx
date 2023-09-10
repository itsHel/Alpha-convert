import { PopupContext } from "../PopupContext";
import { useContext } from "react";

export interface PopupInterface {
    type: string;
    text: string;
    visible?: boolean;
}

export function Popup() {
    const { close, popup } = useContext(PopupContext);

    return (
        <div className="popup-wrapper">
            <div
                onClick={() => close()}
                className={
                    "popup popup-" +
                    popup.type +
                    " " +
                    (popup.visible ? "popup-visible" : "")
                }
            >
                <div className="popup-header">
                    <span className="popup-icons">{pickIco(popup.type)}</span>
                    <span className="popup-text">{popup.type}</span>
                </div>
                <div className="popup-text">{popup.text}</div>
            </div>
        </div>
    );
}

function pickIco(type: string) {
    let ico: React.ReactElement = <></>;

    switch (type) {
        case "error":
            ico = (
                <svg viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <circle cx="12" cy="19" r="2" />
                    <path d="M10 3h4v12h-4z" />
                </svg>
            );
            break;
        case "success":
            ico = (
                <svg viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
            );
            break;
    }

    return ico;
}
