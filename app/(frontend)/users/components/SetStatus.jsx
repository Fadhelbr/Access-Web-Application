'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import sendToSoftPhone from '../../providers/sendToSoftPhone'

const SetStatus = () => {
    const [currentView, setCurrentView] = useState({ name: 'Available', value: 'AVAILABLE', bgColor: 'green' });
    const { setStatus } = sendToSoftPhone();

    const handleViewChange = (view) => {
        if (view.value !== currentView.value) {
            setCurrentView(view);
            setStatus(view.value);
        }
    };

    const status = [
        {
            name: 'Available',
            value: 'AVAILABLE',
        },
        {
            name: 'Busy',
            value: 'BUSY',
        },
        {
            name: 'Away',
            value: 'AWAY',
        },
        {
            name: 'Break',
            value: 'BREAK',
        },
        {
            name: 'Meal',
            value: 'MEAL',
        },
        {
            name: 'Meeting',
            value: 'MEETING',
        },
        {
            name: 'Training',
            value: 'TRAINING',
        },
        {
            name: 'On Queue',
            value: 'ON_QUEUE',
        },
    ];


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`border-2 px-3 m-0 py-1 h-auto w-auto text-black rounded-md border-black cursor-pointer`}
                >
                    {currentView.name} <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {status.map((view) => (
                    <DropdownMenuItem
                        key={view.value}
                        className={`cursor-pointer ${currentView.value === view.value ? "font-bold bg-gray-100" : "font-light"}`}
                        onClick={() => handleViewChange(view)}
                    >
                        {view.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SetStatus