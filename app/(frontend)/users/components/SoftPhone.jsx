'use client';
import { ChevronDown, PanelBottomCloseIcon, PanelBottomOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoftPhone } from '../../providers/SoftPhoneProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import sendToSoftPhone from "../../providers/sendToSoftPhone";

const SoftPhone = () => {
    const { isOpen, setIsOpen } = useSoftPhone();

    const [currentView, setCurrentView] = useState(null);
    const { setView } = sendToSoftPhone();

    const handleViewChange = (view) => {
        if (view === currentView) {
            setCurrentView(null);
        } else {
            setCurrentView(view);
            setView(view);
        }
    };

    const views = [
        'interactionList',
        'callLog',
        'newInteraction',
        'callback',
        'settings'
    ];


    return (
        <div className={`fixed bottom-0 left-20 z-50 w-[300px] ${isOpen && "h-96"} border rounded-t-lg shadow-xl bg-white transition-all duration-300`}>
            <div className={`w-full p-1.5 pl-3 ${isOpen && "border-b border-black"} bg-gray-200 rounded-t-lg flex justify-between items-center`}>
                Soft Phone

                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-[1px] border-black p-0 py-1 m-0 h-auto w-auto cursor-pointer bg-white hover:text-white rounded-md hover:bg-black">
                                Set views <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            {views.map((view) => (
                                <DropdownMenuItem
                                    key={view}
                                    className={`cursor-pointer ${currentView === view ? "font-bold bg-gray-100" : "font-light"}`}
                                    onClick={() => handleViewChange(view)}
                                >
                                    {view}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        className="p-0 py-1 m-0 h-auto w-auto cursor-pointer bg-transparent hover:text-white rounded-md hover:bg-black"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <PanelBottomCloseIcon /> : <PanelBottomOpen />}
                    </Button>
                </div>
            </div>
            <iframe
                id="softphone"
                allow="camera *; microphone *; geolocation *"
                src="https://apps.mypurecloud.jp/crm/index.html?crm=framework-local-secure"
                className={`w-full transition-all duration-300 ${isOpen ? "h-full" : "hidden"}`}
            ></iframe>
        </div>
    );
};

export default SoftPhone;
