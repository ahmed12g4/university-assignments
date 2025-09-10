/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
"use client";

import * as React from "react";

const ToastContext = React.createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = React.useState([]);

    const toast = ({ title, description, variant = "default" }) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, title, description, variant }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000); // يختفي بعد 3 ثواني
    };

    return <ToastContext.Provider value={{ toasts, toast }}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};
