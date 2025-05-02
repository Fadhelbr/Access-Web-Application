'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';


const sendToSoftPhone = () => {
    const softPhoneRef = useRef(null);
    const currentInteractionId = useRef(null);
    const router = useRouter();

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
            data: {
                number: number,
                autoPlace: autoPlace
            }
        };

        try {
            iframe.contentWindow.postMessage(JSON.stringify(message), '*');
        } catch (error) {
            console.error('Error sending message to softphone iframe:', error);
        }
    };

    const setView = (viewName) => {
        const iframe = findSoftPhoneIframe();

        if (!iframe) {
            console.error('Softphone iframe is not available.');
            return;
        }

        console.log('Set view:', viewName);

        const message = {
            type: 'setView',
            data: {
                type: 'main',
                view: {
                    name: viewName
                }
            }
        };

        try {
            iframe.contentWindow.postMessage(JSON.stringify(message), '*');
        } catch (error) {
            console.error('Error sending setView message to softphone iframe:', error);
        }
    }

    const setStatus = (statusName) => {
        const iframe = findSoftPhoneIframe();

        if (!iframe) {
            console.error('Softphone iframe is not available.');
            return;
        }

        console.log('Set status:', statusName);

        const message = {
            type: 'updateUserStatus',
            data: {
                id: statusName
            }
        };

        try {
            iframe.contentWindow.postMessage(JSON.stringify(message), '*');
        } catch (error) {
            console.error('Error sending setView message to softphone iframe:', error);
        }
    }

    const updateAudioConfiguration = (audioConfig) => {
        const iframe = findSoftPhoneIframe();

        if (!iframe) {
            console.error('Softphone iframe is not available.');
            return;
        }

        console.log('Update audio configuration:', audioConfig);

        const message = {
            type: 'updateAudioConfiguration',
            data: audioConfig
        };

        try {
            iframe.contentWindow.postMessage(JSON.stringify(message), '*');
        } catch (error) {
            console.error('Error sending setView message to softphone iframe:', error);
        }
    }

    const updateInteractionState = (state) => {
        const iframe = findSoftPhoneIframe();
        const payloadData = currentInteractionId.current;

        if (!iframe) {
            console.error('Softphone iframe is not available.');
            return;
        } if (!payloadData) {
            console.warn("No interaction payload available.");
            return;
        }

        console.log('Update interaction state:', state);
        const interaction =
            payloadData.data.interaction.old || payloadData.data.interaction;

        const payload = {
            action: state,
            id: interaction.id,
        }

        const message = {
            type: 'updateInteractionState',
            data: payload,
        }

        try {
            iframe.contentWindow.postMessage(JSON.stringify(message), '*');
        } catch (error) {
            console.error('Error sending setView message to softphone iframe:', error);
        }
    }

    const getUserByInteractionId = async (interactionId) => {
        const response = await fetch(`/api/users/interaction/${interactionId}/users`);

        if (!response.ok) {
            toast.error("genesys message", {
                description: `User not found please create user immediately !!!`,
                duration: 10000
            });
        }

        const data = await response.json();
        if (!data) {
            toast.error("genesys message", {
                description: `No user found please create user immediately !!!`,
                duration: 10000
            });
        }

        router.push(`/users/${data.id}`);
    }

    // exmple.js
    useEffect(() => {
        const handleMessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "screenPop") {
                    console.log('Received screenPop:', event.data);
                    // open the Softphone and open detail/create user
                    toast.success("genesys message", {
                        description: `Received screenPop:: ${event.data}`,
                    });
                    getUserByInteractionId(event.data)
                }
                else if (message.type === 'processCallLog') { // outbound
                    console.log('Received call log:', event.data);
                    // sending POST request to backend API then open detail user
                    toast.success("genesys message", {
                        description: `Received call log: ${event.data}`,
                    });
                }
                else if (message.type === 'openCallLog') {
                    console.log('Received open call log:', event.data);
                    // open detail user because the data already stored by the previous process event
                    toast.success("genesys message", {
                        description: `Received open call log: ${event.data}`,
                    });
                }
                else if (message.type == "interactionSubscription") { // inbound
                    console.log('Received interactionSubscription:', event.data);
                    // open detail user because the data already stored by the previous process event
                    toast.success("genesys message", {
                        description: `Received interactionSubscription: ${event.data}`,
                    });
                    currentInteractionId.current = event.data
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        }
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return {
        softPhoneRef,
        clickToDial,
        setView,
        setStatus,
        updateAudioConfiguration,
        updateInteractionState
    };
};

export default sendToSoftPhone;