import React, { createContext, useContext, useState } from 'react';
import { Toaster } from './toaster';

const ToasterContext = createContext();

export function ToasterProvider({ children }) {
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [toastDuration, setToastDuration] = useState('');

    const showToast = (message, type = "s", duration = 10000) => {
        setToastMessage(message);
        setToastType(type);
        setToastDuration(duration);
    };

    return (
        <ToasterContext.Provider value={{ showToast }}>
            {children}
            {toastMessage && <Toaster {...{ message: toastMessage, type: toastType, duration: toastDuration }} />}
        </ToasterContext.Provider>
    );
}

export function useToaster() {
    return useContext(ToasterContext);
}
