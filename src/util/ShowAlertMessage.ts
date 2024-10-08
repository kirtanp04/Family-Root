import React from "react";
import { createRoot } from "react-dom/client";
import { MessageBox } from "~/app/_components/MessageBox";

export const ShowAlertMessage = (MessageTitle: string, Message: string, varient: "success" | "error" | "warning") => {
    if (typeof window === "undefined") {
        return;
    }

    const div = document.createElement("div");
    document.body.appendChild(div);

    const _root = createRoot(div);

    const handleClose = () => {
        _root.unmount();
        div.remove();
    };

    const element = React.createElement(MessageBox, {
        open: true,
        Message: Message,
        MessageTitle: MessageTitle,
        onClose: handleClose,
        varient: varient
    });

    _root.render(element);
};

export default ShowAlertMessage;
