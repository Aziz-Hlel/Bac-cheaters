import { useForm, Controller } from "react-hook-form"
import { firstAndLastRowSchema, type FirstAndLastRowInput } from "../../schemas/mapFirstAndLastRow"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ArrowDownToLine, ArrowUpToLine, Info } from 'lucide-react';

interface MapRowsProps {
    handleMapRowsStep: (columns: FirstAndLastRowInput) => void
}

const MapRows = ({ handleMapRowsStep }: MapRowsProps) => {
    const form = useForm<FirstAndLastRowInput>({
        resolver: zodResolver(firstAndLastRowSchema),
        defaultValues: {
            firstRow: undefined,
            lastRow: undefined,
        }
    })

    const onSubmit = (data: FirstAndLastRowInput) => {
        handleMapRowsStep(data)
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl space-y-6" dir="rtl">
            <div className="text-right space-y-1.5">
                <h3 className="text-lg font-semibold text-foreground">تحديد نطاق صفوف الطلاب</h3>
                <p className="text-sm text-muted-foreground">
                    حدد بداية ونهاية صفوف البيانات الفعلية للطلاب في ملف Excel لتجنب قراءة العناوين أو الصفوف الفارغة.
                </p>
            </div>

            <div className="bg-muted/40 border rounded-lg p-4 flex gap-3 text-right text-sm text-muted-foreground">
                <Info className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="font-semibold text-foreground">كيف أحدد الصفوف بشكل صحيح؟</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong>الصف الأول للبيانات:</strong> هو أول صف يحتوي على بيانات طالب فعلي في الجدول (عادةً ما يكون الصف رقم 2 أو 3 بعد صف العناوين).</li>
                        <li><strong>الصف الأخير للبيانات:</strong> هو آخر صف يحتوي على بيانات طالب فعلي في الجدول (تأكد من عدم تضمين صفوف المجاميع أو الملاحظات في الأسفل).</li>
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                    name="firstRow"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="firstRow-input" className="flex items-center gap-1.5 justify-start">
                                <ArrowDownToLine className="size-4 text-muted-foreground" />
                                <span>الصف الأول للبيانات</span>
                            </FieldLabel>
                            <Input
                                {...field}
                                id="firstRow-input"
                                type="number"
                                min={1}
                                placeholder="مثال: 2"
                                className="text-right font-semibold"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val === "" ? undefined : Number(val));
                                }}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="lastRow"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="lastRow-input" className="flex items-center gap-1.5 justify-start">
                                <ArrowUpToLine className="size-4 text-muted-foreground" />
                                <span>الصف الأخير للبيانات</span>
                            </FieldLabel>
                            <Input
                                {...field}
                                id="lastRow-input"
                                type="number"
                                min={1}
                                placeholder="مثال: 150"
                                className="text-right font-semibold"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val === "" ? undefined : Number(val));
                                }}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="submit" className="px-8">
                    متابعة
                </Button>
            </div>
        </form>
    )
}

export default MapRows