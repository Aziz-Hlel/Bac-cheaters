import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "../../model/student";
import ActionsColumn from "./actions-column";



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
        id: "punishmentDuration",
        header: "مدة العقوبة",
        accessorKey: "punishmentDuration",
        enableHiding: true,
        cell: ({ row }) => {
            const punishmentDuration = row.getValue('punishmentDuration') as number ?? null;
            return <div className="w-fit mx-auto">
                {punishmentDuration !== undefined && punishmentDuration !== null ? (
                    <Badge className="font-mono">
                        {punishmentDuration} سنة
                    </Badge>
                ) : (
                    <span className="text-muted-foreground/50 text-xs">غير محدد</span>
                )}
            </div>
        }
    },
    {
        id: 'punishmentEndYear',
        header: 'سنة انتهاء العقوبة',
        accessorKey: 'punishmentEndYear',
        enableHiding: true,
        cell: ({ row }) => {
            const schoolYear = row.getValue('schoolYear') as number ?? null;
            const punishmentDuration = row.getValue('punishmentDuration') as number ?? null;
            const punishmentEndYear = schoolYear + punishmentDuration;

            const aligeableDate = new Date(`${punishmentEndYear}-07-01`)
            const isPunishmentPassed = new Date().getTime() - aligeableDate.getTime() > 0

            // if (isPunishmentPassed) {
            //     return <div className="font-mono h-full w-full flex justify-center items-center absolute inset-0  text-red-500 bg-red-500/10">
            //         دورة جوان  {punishmentEndYear}
            //     </div>
            // } else {
            //     return <Badge variant="destructive" className="font-mono">
            //         {punishmentEndYear} سنة
            //     </Badge>
            // }

            return (
                <div className={cn("font-mono h-full w-full flex justify-center items-center absolute  inset-0   ",
                    isPunishmentPassed ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                )}
                >
                    {isPunishmentPassed ? `دورة جوان ${punishmentEndYear}` : `دورة جوان ${punishmentEndYear}`}
                </div>
            )
        }
    },
    {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => <ActionsColumn row={row} />,
        enableSorting: false
    },
]
