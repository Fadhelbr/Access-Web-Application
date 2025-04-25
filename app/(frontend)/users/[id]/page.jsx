import React from 'react';
import { CallHistoryTable } from '../components/CallHistoryTable';

const Page = ({ params }) => {

    const userData = {
        id: params.id,
        name: "John Doe",
        email: "john@example.com",
        phone: params.id,
        status: "active",
        createdAt: "2024-04-23T10:30:00.000Z",
        updatedAt: "2024-05-23T10:30:00.000Z",
        callHistory: [
            {
                id: 1,
                interactionId: "123455",
                date: "2024-01-23T10:30:00.000Z",
                direction: "outbound",
                duration: "5:30",
                status: "completed"
            },
            {
                id: 2,
                interactionId: "123456",
                date: "2024-02-23T10:30:00.000Z",
                direction: "inbound",
                duration: "4:30",
                status: "completed"
            },
            {
                id: 3,
                interactionId: "123457",
                date: "2024-03-23T10:30:00.000Z",
                direction: "outbound",
                duration: "3:30",
                status: "missed"
            },
            {
                id: 4,
                interactionId: "123458",
                date: "2024-04-23T10:30:00.000Z",
                direction: "inbound",
                duration: "2:30",
                status: "missed"
            },
            {
                id: 6,
                interactionId: "123459",
                date: "2024-05-22T15:45:00.000Z",
                direction: "outbound",
                duration: "1:30",
                status: "pending"
            }
        ]
    };

    const dateFormat = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <>
            <div className="container mx-auto p-6">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {/* User Header */}
                    <div className="border-b pb-2 mb-4">
                        <h1 className="text-xl font-semibold">User Details</h1>
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
                            <h2 className="text-sm text-gray-600">Phone</h2>
                            <p className="text-md font-medium">{userData.phone}</p>
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

                            <CallHistoryTable userId={userData.id} callHistory={userData.callHistory} />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
