import Link from 'next/link'
import React from 'react'
import SetStatus from '../users/components/SetStatus'
import SetNotification from '../users/components/SetNotification'
import SetInteractionState from '../users/components/SetInteractionState'

const Navbar = () => {

    return (
        <nav className="border-gray-200 bg-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <Link href="/#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-3xl font-bold whitespace-nowrap dark:text-white hover:text-orange-500 transition-all duration-500">Access<span className='text-orange-500 text-xs ml-0.5'>genesys</span></span>
                </Link>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="flex gap-2 border-2 bg-gray-200 shadow p-1.5 px-4 rounded-md border-black">
                    <SetInteractionState />
                    <SetStatus />
                </div>
                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <div className="flex items-center font-medium mt-4 rounded-lg bg-gray-50 space-x-4 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                        <Link href="/users" className="flex gap-2 py-2 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-500 dark:text-white md:dark:hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                            Users
                        </Link>
                        <SetNotification />
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar