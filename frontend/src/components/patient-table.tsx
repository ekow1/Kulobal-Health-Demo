"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Patient } from "@/lib/data";
import { calculateAge } from "@/lib/utils";
import Link from "next/link";

export function PatientTable({ data }: { data: Patient[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  //eslint-disable-next-line
  const [pageSize, setPageSize] = useState(10);

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-semibold text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PATIENT ID
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-3 w-3" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-semibold text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PATIENT NAME
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-3 w-3" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "telephone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-semibold text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            TELEPHONE
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-3 w-3" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-semibold text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DATE OF BIRTH
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-3 w-3" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("dateOfBirth")}</div>,
    },
    {
      accessorKey: "age",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-semibold text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            AGE
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-3 w-3" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const dob = row.original.dateOfBirth;
        return (
          <div className="text-blue-600 font-medium">{calculateAge(dob)}</div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const ageA = calculateAge(rowA.original.dateOfBirth);
        const ageB = calculateAge(rowB.original.dateOfBirth);
        return ageA - ageB;
      },
    },
    {
      accessorKey: "gender",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-semibold text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            GENDER
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-3 w-3" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-emerald-600">{row.getValue("gender")}</div>
      ),
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-semibold text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            LOCATION
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-3 w-3" />
            ) : (
              <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      id: "profile",
      header: "PROFILE",
      enableSorting: false,
      cell: ({ row }) => (
        <Link
          href={`/patients/${row.original.id}`}
          className="flex items-center justify-center"
        >
          <Button variant="outline" size="sm" className="w-full">
            view profile
          </Button>
        </Link>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Set page size when it changes
  const handlePageSizeChange = (value: string) => {
    const newSize = Number.parseInt(value);
    setPageSize(newSize);
    table.setPageSize(newSize);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
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
                      {column.id === "id"
                        ? "Patient ID"
                        : column.id === "name"
                        ? "Patient Name"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing
            <span className="px-1 font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>
            to
            <span className="px-1 font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>
            of
            <span className="px-1 font-medium">
              {table.getFilteredRowModel().rows.length}
            </span>
            entries
          </p>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="flex items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
