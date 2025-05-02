'use client'

import { Button } from '@/components/ui/button'
import sendToSoftPhone from '../../providers/sendToSoftPhone';

const SetInteractionState = () => {
    const { updateInteractionState } = sendToSoftPhone();

    return (
        <>
            <Button onClick={() => updateInteractionState("pickup")} className={"hover:bg-gray-500 cursor-pointer"}>pickup</Button>
            <Button onClick={() => updateInteractionState("disconnect")} className={"hover:bg-gray-500 cursor-pointer"}>disconnect</Button>
            <Button onClick={() => updateInteractionState("hold")} className={"hover:bg-gray-500 cursor-pointer"}>hold</Button>
            <Button onClick={() => updateInteractionState("mute")} className={"hover:bg-gray-500 cursor-pointer"}>mute</Button>
            <Button onClick={() => updateInteractionState("securePause")} className={"hover:bg-gray-500 cursor-pointer"}>secure pause</Button>
        </>
    )
}

export default SetInteractionState