import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from 'zod';
import type { FirstAndLastRowInput } from "../../schemas/mapFirstAndLastRow";
import { type MapPunishmentDurationInput, mapPunishmentDurationSchema } from "../../schemas/mapPunishmentDuration";
import { useExcelWorker } from '../../context/excel-worker-context';
import { AlertCircle, Clock } from 'lucide-react';

interface MapVioltationDurationProps {
    scheetNumber: number;
    firstAndLastRow: FirstAndLastRowInput;
    violationColumn: string;
    handleMapViolationsDurationStep: (violationsDuration: MapPunishmentDurationInput) => void;
}

const MapVioltationDuration = ({ scheetNumber, firstAndLastRow, violationColumn, handleMapViolationsDurationStep }: MapVioltationDurationProps) => {
    const { worker } = useExcelWorker();
    const [isLoading, setIsLoading] = useState(true);
    const [emptyCells, setEmptyCells] = useState<string[]>([]);

    const form = useForm<{ items: MapPunishmentDurationInput }>({
        resolver: zodResolver(z.object({ items: mapPunishmentDurationSchema })),
        defaultValues: {
            items: []
        }
    });

    useEffect(() => {
        let isCancelled = false;

        const fetchViolations = async () => {
            if (!worker) return;
            setIsLoading(true);
            try {
                const result = await worker.getUniqueViolations(
                    scheetNumber,
                    violationColumn,
                    firstAndLastRow.firstRow,
                    firstAndLastRow.lastRow
                );

                if (!isCancelled) {
                    setEmptyCells(result.emptyCells);
                    form.reset({ items: result.uniqueViolationsWithDuration });
                    setIsLoading(false);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error('Error fetching unique violations from worker:', err);
                    setIsLoading(false);
                }
            }
        };

        fetchViolations();

        return () => {
            isCancelled = true;
        };
    }, [worker, scheetNumber, violationColumn, firstAndLastRow, form]);

    const { fields } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const onSubmit = (data: { items: MapPunishmentDurationInput }) => {
        handleMapViolationsDurationStep(data.items);
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-2xl space-y-6" dir="rtl">
                <div className="text-right space-y-1.5">
                    <div className="flex items-center gap-2">
                        <Spinner className="size-4 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">جاري استخراج المخالفات من الملف...</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        نقوم بتحليل عمود المخالفات في الخلفية عبر معالج منفصل لتفادي تجميد الواجهة.
                    </p>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                </div>
            </div>
        );
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

            {fields.length === 0 ? (
                <div className="bg-muted/40 border rounded-lg p-6 text-center text-sm text-muted-foreground">
                    لم يتم العثور على أي نصوص مخالفات في العمود المحدد.
                </div>
            ) : (
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pl-1 pr-1">
                    {fields.map((item, index) => (
                        <Card key={item.id} className="p-4 shadow-sm border bg-zinc-50">
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
                                        name={`items.${index}.value`}
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