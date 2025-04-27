"use client"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ChevronDown, RefreshCwIcon } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";

export function CallHistoryTable({ id }) {
    const columns = [
        {
            accessorKey: "interactionId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full text-center px-10 cursor-pointer"
                    >
                        Interaction Id
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="">{row.getValue("interactionId")}</div>

            )
        },
        {
            accessorKey: "direction",
            header: "Direction",
        },
        {
            accessorKey: "callAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full text-center px-10 cursor-pointer"
                    >
                        Call at
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue("callAt"))
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
            accessorKey: "duration",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full text-center px-10 cursor-pointer"
                    >
                        Duration
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="">{row.getValue("duration")}</div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status")
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "completed"
                        ? "bg-green-100 text-green-800"
                        : status === "missed"
                            ? "bg-red-100 text-red-800"
                            : status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}>
                        {status}
                    </span>
                )
            },
        },
    ];

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] =
        useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    const [error, setError] = useState(null);
    const table = useReactTable({
        data: data,
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
        const fetchData = async () => {
            try {
                const fetchId = await id
                setLoading(true);
                const response = await fetch(`/api/users/${fetchId}/calls`);
                if (!response.ok) {
                    throw new Error('Failed to fetch users data');
                }
                const data = await response.json();
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(error.message);
                setLoading(false);
            }
        }
        fetchData();
    }, [id, refresh])

    return (

        <div className="flex flex-col gap-2">
            <div className="flex items-center py-2">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Filter interactionId..."
                        value={(table.getColumn("interactionId")?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn("interactionId")?.setFilterValue(event.target.value)
                        }
                        className="w-xl max-w-xs"
                    />
                    <Button onClick={() => setRefresh(!refresh)} className={"bg-transparent cursor-pointer hover:bg-gray-100 border"}>
                        <RefreshCwIcon className='text-black' />
                    </Button>
                </div>
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
                                            className={`bg-gray-200 text-gray-900 ${isFirst ? "rounded-tl-sm" : ""
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
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="border-r last:border-r-0"
                                        >
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
                                        : error ? `Error : ${error}` : "No calls recorded."
                                    }
                                </TableCell>

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* <div className="flex items-center justify-end space-x-2 py-2">
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