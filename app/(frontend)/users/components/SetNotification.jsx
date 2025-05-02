'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Bell, BellOff, BellRing, Check } from 'lucide-react'
import sendToSoftPhone from '../../providers/sendToSoftPhone'

const SetNotification = () => {
    const { updateAudioConfiguration } = sendToSoftPhone();
    const [audioConfig, setAudioConfig] = useState({
        call: true,
        email: true,
        callback: true,
        chat: true,
        message: true,
        voicemail: true
    });

    // Convert object to array for mapping in dropdown
    const audioOptions = [
        { name: 'Call', value: 'call' },
        { name: 'Email', value: 'email' },
        { name: 'Callback', value: 'callback' },
        { name: 'Chat', value: 'chat' },
        { name: 'Message', value: 'message' },
        { name: 'Voicemail', value: 'voicemail' }
    ];

    const handleAudioConfigChange = (type) => {
        const newConfig = {
            ...audioConfig,
            [type]: !audioConfig[type]
        };

        setAudioConfig(newConfig);
        updateAudioConfiguration(newConfig);
    };

    const belRing = () => {
        let on = 0;
        audioOptions.map(option => {
            audioConfig[option.value] === true && on++
        })

        return on >= 4 ? <BellRing className="m-0" /> :
            on >= 1 ? <Bell className="m-0" /> : <BellOff className="m-0" />
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="p-0 m-0 py-1 h-auto w-auto text-black rounded-md cursor-pointer border-2 border-black"
                >
                    {audioOptions.map(option => {
                        audioConfig[option.value] === true ? <BellRing className="m-0" /> : <BellOff className="m-0" />
                    })}
                    {belRing()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                    Audio Notifications
                </div>
                {audioOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        className="cursor-pointer flex items-center justify-between"
                        onClick={() => handleAudioConfigChange(option.value)}
                    >
                        <span>{option.name}</span>
                        {audioConfig[option.value] && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SetNotification