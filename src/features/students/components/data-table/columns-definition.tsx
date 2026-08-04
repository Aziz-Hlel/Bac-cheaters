import type { ColumnDef } from "@tanstack/react-table"
import type { Student } from "../../model/student"
import ActionsColumn from "./actions-column"



export const columns: ColumnDef<Student>[] = [
    {
        id: 'schoolYear',
        header: 'الدورة',
        accessorKey: 'schoolYear',
        enableHiding: true,
        cell: ({ row }) => <div>{`دورة ${row.getValue('schoolYear') ?? '-'}`}</div>
    },
    {
        id: 'name',
        header: 'الاسم واللقب',
        accessorKey: 'name',
        cell: ({ row }) => <div className='font-medium'>{row.getValue('name') ?? '-'}</div>,
        sortUndefined: 'last',
        enableHiding: false,
        sortDescFirst: false
    },
    {
        id: 'cin',
        header: 'رقم ب.ت.و',
        accessorKey: 'cin',
        enableHiding: false,
        cell: ({ row }) => <div>{row.getValue('cin') ?? '-'}</div>
    },
    {
        id: 'delegation',
        header: 'المندوبية',
        accessorKey: 'delegation',
        enableHiding: true,
        cell: ({ row }) => <div>{row.getValue('delegation') ?? '-'}</div>
    },
    {
        id: 'section',
        header: 'الشعبة',
        accessorKey: 'section',
        enableHiding: true,
        cell: ({ row }) => <div>{row.getValue('section') ?? '-'}</div>
    },
    {
        id: 'registrationNumber',
        header: 'رقم التسجيل',
        accessorKey: 'registrationNumber',
        enableHiding: true,
        cell: ({ row }) => <div>{row.getValue('registrationNumber') ?? '-'}</div>
    },
    {
        id: 'registrationType',
        header: 'نوع التسجيل',
        accessorKey: 'registrationType',
        enableHiding: true,
        cell: ({ row }) => <div>{row.getValue('registrationType') ?? '-'}</div>
    },
    {
        id: 'originalInstitute',
        header: 'المعهد الأصلي',
        accessorKey: 'originalInstitute',
        enableHiding: true,
        cell: ({ row }) => <div>{row.getValue('originalInstitute') ?? '-'}</div>
    },
    {
        id: 'punishmentEndYear',
        header: 'سنة انتهاء العقوبة',
        accessorKey: 'punishmentEndYear',
        enableHiding: true,
        cell: ({ row }) => <div>{row.getValue('punishmentEndYear') ?? '-'}</div>
    },
    {
        id: 'punishmentReason',
        header: 'سبب العقوبة',
        accessorKey: 'punishmentReason',
        enableHiding: true,
        cell: ({ row }) => <div>{row.getValue('punishmentReason') ?? '-'}</div>
    },
    {
        id: 'violation',
        header: 'العقوبة',
        accessorKey: 'violation',
        enableHiding: true,
        cell: ({ row }) => <div>{row.getValue('violation') ?? '-'}</div>
    },
    {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => <ActionsColumn row={row} />
    },
]
