'use client';
import { useRef } from 'react';

const useClickToDial = () => {
    const softPhoneRef = useRef(null);

    const findSoftPhoneIframe = () => {
        return document.getElementById('softphone');
    };

    const clickToDial = (number, autoPlace = true) => {
        const iframe = findSoftPhoneIframe();

        if (!iframe) { 
            console.error('Softphone iframe is not available.');
            return;
        }

        console.log('Click to dial:', number, autoPlace);
        const message = {
            type: 'clickToDial',
            data: { number, autoPlace }
        };

        try {
            iframe.contentWindow.postMessage(JSON.stringify(message), '*');
        } catch (error) {
            console.error('Error sending message to softphone iframe:', error);
        }
    };

    return {
        softPhoneRef,
        clickToDial
    };
};

export default useClickToDial;