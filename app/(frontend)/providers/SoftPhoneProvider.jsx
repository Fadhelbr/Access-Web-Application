'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

const SoftPhoneContext = createContext();

export const useSoftPhone = () => useContext(SoftPhoneContext);

export const SoftPhoneProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    useEffect(() => {
        const storedIsOpen = localStorage.getItem('softphone-isOpen');
        if (storedIsOpen !== null) {
            setIsOpen(storedIsOpen === 'true');
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('softphone-isOpen', isOpen.toString());
    }, [isOpen]);

    
    return (
        <SoftPhoneContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </SoftPhoneContext.Provider>
    )
}

// buat make provider secara global
// const { setIsOpen } = useSoftPhone();
