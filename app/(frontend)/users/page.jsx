import React from 'react';
import { UserTable } from './components/UserTable';

const Page = () => {
  
    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="border-b pb-2">
                    <h1 className="text-2xl font-semibold">Users</h1>
                </div>
                <div className="">
                    <UserTable />
                </div>
            </div>
        </div>
    );
};

export default Page;
