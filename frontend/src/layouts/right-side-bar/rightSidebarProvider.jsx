import React, { createContext, useContext, useState } from 'react';
import RightSideBar from './rightSidebar';

const RightSidebarContext = createContext();

export function RightSidebarProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [contentData, setContentData] = useState(null);

    const showRightSidebar = (contentData) => {
        setOpen(true);
        setContentData(contentData);
    };

    const handleContent = () => {
        return contentData.content(contentData.data);
    }

    return (
        <RightSidebarContext.Provider value={{ showRightSidebar }}>
            {children}
            {open && <RightSideBar {...{ handleContent, open }} />}
        </RightSidebarContext.Provider>
    );
}

export function useRightSidebar() {
    return useContext(RightSidebarContext);
}
