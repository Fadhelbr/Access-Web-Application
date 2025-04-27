'use client';
import { PanelBottomCloseIcon, PanelBottomOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoftPhone } from '../../providers/SoftPhoneProvider';

const SoftPhone = () => {
    const { isOpen, setIsOpen } = useSoftPhone();


    return (
        <div className={`fixed bottom-0 left-20 z-50 w-[300px] ${isOpen && "h-96"} border rounded-t-lg shadow-xl bg-white transition-all duration-300`}>
            <div className={`w-full p-1.5 pl-3 ${isOpen && "border-b border-black"} bg-gray-200 rounded-t-lg flex justify-between items-center`}>
                Soft Phone
                <Button
                    variant="ghost"
                    className="p-0 py-1 m-0 h-auto w-auto cursor-pointer bg-transparent hover:text-white rounded-md hover:bg-black"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <PanelBottomCloseIcon /> : <PanelBottomOpen />}
                </Button>
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
