"use client"
import React from "react";
import { createRoot } from "react-dom/client";
import LoadingWrapper from "~/app/_components/Loading";

let _root: any = null;
let _div: HTMLDivElement | null = null;

const showLoading = (show: boolean) => {

    if (typeof window === "undefined") {
        return;
    }

    if (show) {


        if (!_div) {
            _div = document.createElement("div");
            document.body.appendChild(_div);
        }

        if (!_root) {
            _root = createRoot(_div);
        }

        let element = React.createElement(LoadingWrapper);

        _root.render(element);
    } else {
        if (_root) {
            _root.unmount();
            _root = null;
        }

        if (_div) {
            _div.remove();
            _div = null;
        }
    }
};

export default showLoading;
