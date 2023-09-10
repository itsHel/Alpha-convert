import React from "react";

interface PopupContextInterface {
    open: (p: PopupInterface) => void;
    close: () => void;
    popup: PopupInterface;
}

interface PopupInterface {
    type: string;
    text: string;
    visible?: boolean;
}

const popupTimeoutDelay = 6000;
let popupTimeout: ReturnType<typeof setTimeout> | undefined;

export const PopupContext = React.createContext<PopupContextInterface>(
    {} as PopupContextInterface,
);

export function PopupProvider({ children }: { children: React.ReactNode }) {
    const [popupData, setPopupData] = React.useState<PopupInterface>({
        type: "",
        text: "",
        visible: false,
    });

    return (
        <PopupContext.Provider
            value={{ open: open, close: close, popup: popupData }}
        >
            {children}
        </PopupContext.Provider>
    );

    function open(data: PopupInterface) {
        setPopupData({
            ...data,
            visible: true,
        });

        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => {
            close();
        }, popupTimeoutDelay);
    }

    function close() {
        setPopupData({
            ...popupData,
            visible: false,
        });

        clearTimeout(popupTimeout);
    }
}
