"use client"

import React, { useEffect, useState } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Phone, RefreshCwIcon, UserPlus } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { useSoftPhone } from '../../providers/SoftPhoneProvider'
import CreateUser from './CreateUser'
import useClickToDial from '../../providers/useClickToDial'

export const columns = [
    {
        accessorKey: "name",
        header: () => <div className="w-full text-center">Name</div>,
        cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full text-center px-10 cursor-pointer"
                >
                    Email
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="w-full text-center px-10 cursor-pointer"
            >
                <span className="flex items-center justify-center gap-2">
                    Phone
                    <ArrowUpDown className="h-4 w-4" />
                </span>
            </Button>
        ),
        cell: ({ row }) => {
            const phone = row.getValue("phone");
            const userId = row.original.id;
            const { setIsOpen } = useSoftPhone();
            const { clickToDial } = useClickToDial();

            const handlePhoneClick = (e) => {
                // e.preventDefault();
                setIsOpen(true)
                clickToDial(phone);

            }

            return (
                <Link
                    href={`/users/${userId}`}
                    onClick={handlePhoneClick}
                    className="w-fit hover:underline flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-100"
                >
                    <Phone size={16} className="text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">
                        {phone || "N/A"}
                    </span>
                </Link>
            );
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="w-full text-center">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status")
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "active"
                    ? "bg-green-100 text-green-800"
                    : status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {status}
                </span>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full text-center px-10 cursor-pointer"
                >
                    Created at
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const users = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-full justify-center p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(users.phone)}
                        >
                            Copy phone number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href={`/users/${users.id}`}>View user detail</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function UserTable() {
    const [isClient, setIsClient] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [data, setData] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] =
        useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    const [error, setError] = useState(null);
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/users");
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const users = await response.json();
                setData(users);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(error.message);
                setLoading(false);
            }
        };
        setIsClient(true);
        fetchUsers();
    }, [refresh]);

    if (!isClient) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Filter emails..."
                        value={(table.getColumn("email")?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn("email")?.setFilterValue(event.target.value)
                        }
                        className="w-xl max-w-xs"
                    />
                    <Button onClick={() => setRefresh(!refresh)} className={"bg-transparent cursor-pointer hover:bg-gray-100 border"}>
                        <RefreshCwIcon className='text-black' />
                    </Button>
                </div>

                <div className="flex gap-2">
                    <CreateUser />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === headerGroup.headers.length - 1;
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`bg-gray-200 text-grey-900 ${isFirst ? "rounded-tl-sm" : ""
                                                } ${isLast ? "rounded-tr-sm" : ""
                                                }`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="border " >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {loading ? "Loading..."
                                        : error ? `Error : ${error}` : "No results."
                                    }
                                </TableCell>

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/*     <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div> */}
        </div>
    )
}
