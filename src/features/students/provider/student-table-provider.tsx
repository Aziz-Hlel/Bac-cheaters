


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

import MiniSearch from 'minisearch';

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

    const cinFuse = useMemo(
        () =>
            new Fuse(students, {
                keys: ['cin'],
                threshold: 0.3,
                includeScore: true,
            }),
        [students],
    );

    const normalizeArabic = (text: string) =>
        text
            ? text
                .toLowerCase()
                .replace(/[أإآ]/g, 'ا')
                .replace(/ة/g, 'ه')
                .replace(/ى/g, 'ي')
                .replace(/\bال/g, '')
                .replace(/[\u064B-\u0652]/g, '')
                .trim()
            : '';

    const nameFuse = useMemo(() => {
        const miniSearch = new MiniSearch({
            fields: ['name'],
            storeFields: [
                "id",
                "cin",
                "name",
                "delegation",
                "section",
                "schoolYear",
                "registrationNumber",
                "registrationType",
                "originalInstitute",
                "punishmentReason",
                "violation",
                "punishmentDuration",
                "createdAt",
            ],
            // 1. Normalizes indexed text so "آدم" and "ادم" are stored identically
            processTerm: (term) => normalizeArabic(term),
            searchOptions: {
                prefix: true,
                fuzzy: 0.6, // Lowered from 0.5 to prevent high fuzzy scores
                combineWith: 'AND',
                // 2. Heavy penalty on fuzzy/prefix matches relative to exact matches
                weights: { fuzzy: 0.1, prefix: 0.3 },
            },
        });

        miniSearch.addAll(students);

        return {
            search: (searchQuery: string) => {
                const trimmed = searchQuery.trim();
                if (!trimmed) return [];

                const normQuery = normalizeArabic(trimmed);
                const results = miniSearch.search(trimmed);

                // 3. Guarantee exact normalized matches float to #1
                return results
                    .sort((a, b) => {
                        const normA = normalizeArabic(a.name);
                        const normB = normalizeArabic(b.name);

                        const isExactA = normA === normQuery ? 1 : 0;
                        const isExactB = normB === normQuery ? 1 : 0;

                        // If one item is an exact 100% match, put it first
                        if (isExactA !== isExactB) {
                            return isExactB - isExactA;
                        }

                        // Fallback to MiniSearch score for rest
                        return b.score - a.score;
                    })
                    .map((item) => ({ item })) as unknown as { item: Student }[];
            },
        };
    }, [students]);

    const studentsData = useMemo(() => {
        if (globalFilter) {
            const fuse = searchKey === 'name' ? nameFuse : cinFuse;
            return fuse.search(globalFilter).map((item) => item.item);
        }
        return students
    }, [cinFuse, globalFilter, searchKey, students, nameFuse])

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
