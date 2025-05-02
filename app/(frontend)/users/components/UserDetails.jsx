'use client'
import React, { useEffect, useState } from 'react'
import { CallHistoryTable } from './CallHistoryTable';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoftPhone } from '../../providers/SoftPhoneProvider';
import Link from 'next/link';
import sendToSoftPhone from '../../providers/sendToSoftPhone';
import { UpdateUserDialog } from './EditUser';
import { toast } from "sonner";

const UserDetails = ({ id }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setIsOpen } = useSoftPhone();
    const [refresh, setRefresh] = useState(true);
    const { clickToDial } = sendToSoftPhone();



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserData(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, refresh]);

    const dateFormat = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="container mx-auto p-6">Loading user data...</div>;
    if (error) return <div className="container mx-auto p-6">Error: {error}</div>;
    if (!userData) return <div className="container mx-auto p-6">No user data found</div>;

    const handlePhoneClick = (e) => {
        if (userData.phone) {
            toast.success("Soft phone", {
                description: `Calling ${userData.name} ...`,
            });
            setIsOpen(true)
            clickToDial(userData.phone);
        }
    }

    return (
        <>
            <div className="container mx-auto p-6">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {/* User Header */}
                    <div className="border-b pb-2 mb-4 flex justify-between">
                        <h1 className="text-2xl font-semibold"><Link href="/users">User Details</Link> / <span className='font-light'>{userData.id}</span></h1>
                        <UpdateUserDialog id={userData.id} refresh={refresh} setRefresh={setRefresh} />
                    </div>

                    {/* Basic Information */}
                    <div className="w-full grid grid-cols-3 gap-4 mb-6 px-4">
                        <div>
                            <h2 className="text-sm text-gray-600">Name</h2>
                            <p className="text-md font-medium">{userData.name}</p>
                        </div>
                        <div>
                            <h2 className="text-sm text-gray-600">Email</h2>
                            <p className="text-md font-medium">{userData.email}</p>
                        </div>
                        <div>
                            <h2 className="text-sm text-gray-600">Created At</h2>
                            <p className="text-md font-medium capitalize">{dateFormat(userData.createdAt)}</p>
                        </div>
                        <div>
                            <h2 className="text-sm text-gray-600">Status</h2>
                            <p className="text-md font-medium capitalize">{userData.status}</p>
                        </div>

                        <div>
                            <h2 className="text-sm text-gray-600 flex">Phone</h2>
                            <div className="flex items-center gap-2">
                                <p className="text-md font-medium">{userData.phone}</p>
                                <Button
                                    onClick={handlePhoneClick}
                                    className={"bg-white border p-0 hover:bg-slate-100 cursor-pointer"}>
                                    <Phone size={16} className="text-slate-500 flex-shrink-0" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm text-gray-600">Updated At</h2>
                            <p className="text-md font-medium capitalize">{dateFormat(userData.updatedAt)}</p>
                        </div>
                    </div>

                    {/* Call History */}
                    <div className="mt-8">
                        <div className="border-b pb-2 mb-2">
                            <h1 className="text-xl font-semibold">Call History</h1>
                        </div>
                        <div className="overflow-x-auto">
                            <CallHistoryTable id={userData.id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetails;