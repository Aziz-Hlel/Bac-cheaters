import React, { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CheckCircle2, Info } from 'lucide-react';
import type { KeysToExcelColumnsInput } from '../../schemas/keysToExcelColumns';
import type { FirstAndLastRowInput } from '../../schemas/mapFirstAndLastRow';

interface ConfirmExampleProps {
    excelArrayBuffer: ArrayBuffer;
    scheetNumber: number;
    firstAndLastRow: FirstAndLastRowInput;
    columns: KeysToExcelColumnsInput;
    violationsDuration: Record<string, number | null>;
    handleConfirmExamplesStep: () => void;
}

const COLUMN_LABELS: Record<keyof KeysToExcelColumnsInput, string> = {
    cin: 'رقم ب.ت.و',
    name: 'الاسم واللقب',
    delegation: 'المندوبية',
    section: 'الشعبة',
    registrationNumber: 'رقم التسجيل',
    registrationType: 'نوع التسجيل',
    originalInstitute: 'المؤسسة الأصلية',
    punishmentReason: 'سبب العقوبة',
    violation: 'العقوبة',
};

const ConfirmExamples = ({
    excelArrayBuffer,
    scheetNumber,
    firstAndLastRow,
    columns,
    violationsDuration,
    handleConfirmExamplesStep,
}: ConfirmExampleProps) => {
    const { activeKeys, previewRows, isOverlap } = useMemo(() => {
        const workbook = XLSX.read(excelArrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[scheetNumber]];

        const keys = (Object.keys(columns) as (keyof KeysToExcelColumnsInput)[]).filter(
            (key) => Boolean(columns[key])
        );

        const totalRows = firstAndLastRow.lastRow - firstAndLastRow.firstRow + 1;
        const first3RowIndexes: number[] = [];
        for (let i = 0; i < Math.min(3, totalRows); i++) {
            first3RowIndexes.push(firstAndLastRow.firstRow + i);
        }

        const last3RowIndexes: number[] = [];
        for (let i = Math.max(0, totalRows - 3); i < totalRows; i++) {
            const rowNum = firstAndLastRow.firstRow + i;
            if (!first3RowIndexes.includes(rowNum)) {
                last3RowIndexes.push(rowNum);
            }
        }

        const getRowData = (rowNum: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rowObj: Record<string, any> = { rowNum };
            keys.forEach((key) => {
                const colLetter = columns[key];
                if (colLetter) {
                    const cellAddress = `${colLetter}${rowNum}`;
                    const val = sheet[cellAddress]?.v;
                    rowObj[key] = val !== undefined && val !== null ? String(val).trim() : '';
                }
            });
            return rowObj;
        };

        const first3 = first3RowIndexes.map(getRowData);
        const last3 = last3RowIndexes.map(getRowData);
        const overlap = first3RowIndexes.length + last3RowIndexes.length >= totalRows;

        return {
            activeKeys: keys,
            previewRows: { first3, last3 },
            isOverlap: overlap,
        };
    }, [excelArrayBuffer, scheetNumber, firstAndLastRow, columns]);

    return (
        <div className="w-full max-w-5xl space-y-6" dir="rtl">
            <div className="text-right space-y-1.5">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-primary" />
                    <span>التأكيد النهائي لمعاينة البيانات</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                    يرجى مراجعة وتأكيد عينة من البيانات المعتمدة (أول 3 صفوف وآخر 3 صفوف) قبل الانتقال للمرحلة التالية. إذا كان كل شيء سليمًا، اضغط على زر التالي للمتابعة.
                </p>
            </div>

            <div className="bg-muted/40 border rounded-lg p-4 flex gap-3 text-right text-sm text-muted-foreground">
                <Info className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="font-semibold text-foreground">تأكد من صحة الأعمدة ومدد العقوبات</p>
                    <p className="text-xs">
                        تمت إضافة عمود <strong>مدة العقوبة (بالسنوات)</strong> تلقائيًا بجانب عمود نص المخالفة بناءً على القيم المدخلة في الخطوة السابقة.
                    </p>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <Table className="text-right">
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="text-right font-bold w-16">رقم الصف</TableHead>
                                {activeKeys.map((key) => (
                                    <React.Fragment key={key}>
                                        <TableHead className="text-right font-bold">
                                            {COLUMN_LABELS[key]}
                                            <span className="text-xs font-mono opacity-60 mr-1">
                                                ({columns[key]})
                                            </span>
                                        </TableHead>
                                        {key === 'violation' && (
                                            <TableHead className="text-right font-bold text-primary bg-primary/5">
                                                مدة العقوبة (بالسنوات)
                                            </TableHead>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {previewRows.first3.map((row) => (
                                <TableRow key={`first-${row.rowNum}`}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        #{row.rowNum}
                                    </TableCell>
                                    {activeKeys.map((key) => (
                                        <React.Fragment key={key}>
                                            <TableCell className="max-w-50 truncate">
                                                {row[key] || <span className="text-muted-foreground/40 italic">فارغ</span>}
                                            </TableCell>
                                            {key === 'violation' && (
                                                <TableCell className="bg-primary/5 font-semibold">
                                                    {violationsDuration[row[key]] !== undefined && violationsDuration[row[key]] !== null ? (
                                                        <Badge variant="secondary" className="font-mono">
                                                            {violationsDuration[row[key]]} سنة
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground/50 text-xs">غير محدد</span>
                                                    )}
                                                </TableCell>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                            ))}

                            {!isOverlap && (
                                <TableRow className="bg-muted/20 hover:bg-muted/20">
                                    <TableCell
                                        colSpan={activeKeys.length + (activeKeys.includes('violation') ? 2 : 1)}
                                        className="text-center py-3 font-bold text-muted-foreground tracking-widest"
                                    >
                                        <div className='flex flex-col '>
                                            <span>. </span>
                                            <span>. </span>
                                            <span>. </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isOverlap &&
                                previewRows.last3.map((row) => (
                                    <TableRow key={`last-${row.rowNum}`}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            #{row.rowNum}
                                        </TableCell>
                                        {activeKeys.map((key) => (
                                            <React.Fragment key={key}>
                                                <TableCell className="max-w-50 truncate">
                                                    {row[key] || <span className="text-muted-foreground/40 italic">فارغ</span>}
                                                </TableCell>
                                                {key === 'violation' && (
                                                    <TableCell className="bg-primary/5 font-semibold">
                                                        {violationsDuration[row[key]] !== undefined && violationsDuration[row[key]] !== null ? (
                                                            <Badge variant="secondary" className="font-mono">
                                                                {violationsDuration[row[key]]} سنة
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground/50 text-xs">غير محدد</span>
                                                        )}
                                                    </TableCell>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <p className="text-sm font-medium text-muted-foreground">
                    إذا كان كل شيء يبدو صحيحًا ومطابقًا، يرجى الضغط على زر <strong>التالي</strong> للتأكيد والمتابعة.
                </p>
                <Button onClick={handleConfirmExamplesStep} className="px-8 font-semibold">
                    التالي
                </Button>
            </div>
        </div>
    );
};

export default ConfirmExamples;