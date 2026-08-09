


import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type PaginationState,
    type SortingState,
    type Table,
    type VisibilityState
} from '@tanstack/react-table';
import Fuse from 'fuse.js';
import {
    createContext,
    useContext,
    useMemo,
    useState,
    type PropsWithChildren
} from 'react';
import { columns } from '../components/data-table/columns-definition';
import { useStudents } from '../hooks/useStudents';
import type { Student } from '../model/student';
import type { SearchKey } from '../types/searchKey';


type StudentTableContextType = {
    table: Table<Student>
    sorting: SortingState,
    columnOrder: string[],
    columnVisibility: VisibilityState,
    globalFilter: string,
    pagination: PaginationState,
    searchKey: SearchKey,
    setSorting: (sorting: SortingState) => void,
    setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>,
    setColumnVisibility: (columnVisibility: VisibilityState) => void,
    setGlobalFilter: (globalFilter: string) => void,
    setPagination: (pagination: PaginationState) => void,
    setSearchKey: (searchKey: SearchKey) => void,
}


const StudentsTableContext = createContext<StudentTableContextType | null>(null);

export function StudentsTableProvider({ children }: PropsWithChildren) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [searchKey, setSearchKey] = useState<SearchKey>('name');
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const { students } = useStudents();
    const nameFuse = useMemo(
        () =>
            new Fuse(students, {
                keys: ['name'],
                threshold: 0.3,
                includeScore: true,
            }),
        [students],
    );

    const cinFuse = useMemo(
        () =>
            new Fuse(students, {
                keys: ['cin'],
                threshold: 0.3,
                includeScore: true,
            }),
        [students],
    );



    const studentsData = useMemo(() => {
        if (globalFilter) {
            const fuse = searchKey === 'name' ? nameFuse : cinFuse;
            return fuse.search(globalFilter).map((item) => item.item);
        }
        return students
    }, [cinFuse, globalFilter, nameFuse, searchKey, students])

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: studentsData,
        columns,

        state: {
            sorting,
            columnOrder,
            columnVisibility,
            globalFilter,
            pagination
        },

        onSortingChange: setSorting,
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        columnResizeMode: 'onChange',

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        enableSortingRemoval: false,
    });


    const value: StudentTableContextType = {
        table,
        sorting,
        columnOrder,
        columnVisibility,
        globalFilter,
        pagination,
        searchKey,
        setSorting,
        setColumnOrder,
        setColumnVisibility,
        setGlobalFilter,
        setPagination,
        setSearchKey
    }

    return (
        <StudentsTableContext.Provider value={value}>
            {children}
        </StudentsTableContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStudentsTable() {
    const context = useContext(StudentsTableContext);

    if (!context) throw new Error('useStudentsTable must be used within StudentsTableProvider');
    return context;
}
