import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { studentsSeed } from '../data/students.seed';
import { columns } from '../components/data-table/columns-definition';

export const useTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: studentsSeed,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnOrder,
      globalFilter,

      columnVisibility,
    },
    onColumnOrderChange: setColumnOrder,
    enableSortingRemoval: false,
  });

  return {
    table,
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
  };
};
