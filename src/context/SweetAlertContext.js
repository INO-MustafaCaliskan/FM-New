'use client';

import React, { createContext, useContext, useState } from 'react';
import SweetAlert2 from 'react-sweetalert2';

const SweetAlertContext = createContext();

export const useSweetAlert = () => useContext(SweetAlertContext);

export const SweetAlertProvider = ({ children }) => {
    const [swalProps, setSwalProps] = useState({ show: false });

    const showAlert = (props) => {
        setSwalProps({ ...props, show: true });
    };

    const hideAlert = () => {
        setSwalProps({ show: false });
    };

    return (
        <SweetAlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <SweetAlert2 {...swalProps} />
        </SweetAlertContext.Provider>
    );
};