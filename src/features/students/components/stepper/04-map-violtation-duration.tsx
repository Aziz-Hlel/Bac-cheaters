import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as XLSX from 'xlsx';
import type { FirstAndLastRowInput } from "../../schemas/mapFirstAndLastRow";
import { type MapPunishmentDurationInput, mapPunishmentDurationSchema } from "../../schemas/mapPunishmentDuration";


import { AlertCircle, Clock } from 'lucide-react';

interface MapVioltationDurationProps {
    excelArrayBuffer: ArrayBuffer;
    scheetNumber: number;
    firstAndLastRow: FirstAndLastRowInput;
    violationColumn: string;
    handleMapViolationsDurationStep: (violationsDuration: MapPunishmentDurationInput) => void;
}

const extractDurationFromViolationText = (text: string): number | null => {
    const normalized = text
        .trim()
        .replace(/[٠-٩]/g, d =>
            String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
        );

    // find positive numbers
    const match = normalized.match(/\d+/);

    if (match) {
        return Number(match[0]);
    }

    if (normalized.includes("سنة")) {
        return 1;
    }

    if (
        normalized.includes("سنتين") ||
        normalized.includes("سنتان")
    ) {
        return 2;
    }

    return null;
}

const MapVioltationDuration = ({ excelArrayBuffer, scheetNumber, firstAndLastRow, violationColumn, handleMapViolationsDurationStep }: MapVioltationDurationProps) => {

    const [uniqueViolationsWithDuration, emptyCells] = useMemo(() => {

        const workbook = XLSX.read(excelArrayBuffer, { type: 'array' });

        const sheet = workbook.Sheets[workbook.SheetNames[scheetNumber]];

        const values = new Set<string>();
        const emptyCells: string[] = [];

        for (let row = firstAndLastRow.firstRow; row <= firstAndLastRow.lastRow; row++) {
            const cellAddress = `${violationColumn}${row}`;

            const cellValue = sheet[cellAddress]?.v;

            const isEmpty =
                cellValue === undefined ||
                cellValue === null ||
                (typeof cellValue === 'string' && cellValue.trim() === '');

            if (isEmpty) {
                emptyCells.push(cellAddress);
                continue;
            }

            values.add(String(cellValue).trim());
        }

        const violationWithDuration: { text: string, value: number | null }[] = []
        values.forEach((violation) => {
            violationWithDuration.push({ text: violation, value: extractDurationFromViolationText(violation) })
        })

        return [violationWithDuration, emptyCells]
    }, [excelArrayBuffer, firstAndLastRow, scheetNumber, violationColumn]);

    const form = useForm<MapPunishmentDurationInput>({
        resolver: zodResolver(mapPunishmentDurationSchema),
        defaultValues: uniqueViolationsWithDuration
    })

    useEffect(() => {
        form.reset(uniqueViolationsWithDuration)
    }, [uniqueViolationsWithDuration, form])

    const onSubmit = (data: MapPunishmentDurationInput) => {
        handleMapViolationsDurationStep(data)
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-6" dir="rtl">
            <div className="text-right space-y-1.5">
                <h3 className="text-lg font-semibold text-foreground">تحديد مدة العقوبة لكل مخالفة</h3>
                <p className="text-sm text-muted-foreground">
                    تم استخراج نصوص المخالفات المختلفة تلقائياً. يرجى مراجعة وتأكيد عدد سنوات الحرمان/العقوبة المستنتجة لكل مخالفة.
                </p>
            </div>

            {emptyCells.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 flex gap-3 text-right text-sm">
                    <AlertCircle className="size-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-semibold">تنبيه: توجد خلايا فارغة في عمود المخالفات</p>
                        <p className="text-xs opacity-90">
                            تم العثور على {emptyCells.length} خلايا لا تحتوي على أي نص مخالفة في النطاق المحدد:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {emptyCells.map((cell) => (
                                <Badge key={cell} variant="destructive" className="font-mono text-xs">
                                    {cell}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {uniqueViolationsWithDuration.length === 0 ? (
                <div className="bg-muted/40 border rounded-lg p-6 text-center text-sm text-muted-foreground">
                    لم يتم العثور على أي نصوص مخالفات في العمود المحدد.
                </div>
            ) : (
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pl-1 pr-1">
                    {uniqueViolationsWithDuration.map((item, index) => (
                        <Card key={index} className="p-4 shadow-sm border bg-zinc-50">
                            <CardContent className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="shrink-0">
                                            المخالفة {index + 1}
                                        </Badge>
                                        <p className="text-sm font-medium text-foreground">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full sm:w-48 shrink-0">
                                    <Controller
                                        name={`${index}.value`}
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={`violation-${index}`} className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="size-3.5" />
                                                    <span>مدة العقوبة (بالسنوات)</span>
                                                </FieldLabel>
                                                <Input
                                                    id={`violation-${index}`}
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="أدخل مدة العقوبة"
                                                    className="text-right font-semibold"
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === "") {
                                                            field.onChange(null);
                                                            return;
                                                        }
                                                        if (/^\d+$/.test(val)) {
                                                            field.onChange(Number(val));
                                                        }
                                                    }}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <Button type="submit" className="px-8">
                    متابعة
                </Button>
            </div>
        </form>
    )
}

export default MapVioltationDuration