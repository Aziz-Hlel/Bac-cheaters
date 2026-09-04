import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertCircle as AlertCircleIcon,
    AlertTriangle as AlertTriangleIcon,
    Building2 as BuildingIcon,
    FileText as FileTextIcon,
    GraduationCap as GraduationCapIcon,
    Hash as HashIcon,
    IdCard as IdCardIcon,
    School as SchoolIcon,
    User as UserIcon,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { keysToExcelColumnsSchema, type KeysToExcelColumnsInput } from "../../schemas/keysToExcelColumns";

interface MapColumnsProps {
    handleMapColumnsStep: (columns: KeysToExcelColumnsInput) => void;
}

const MapColumns = ({ handleMapColumnsStep }: MapColumnsProps) => {
    const form = useForm<KeysToExcelColumnsInput>({
        resolver: zodResolver(keysToExcelColumnsSchema),
        defaultValues: {
            cin: null,
            delegation: null,
            section: null,
            registrationNumber: null,
            registrationType: null,
            originalInstitute: null,
            punishmentReason: null,
        }
    });

    const onSubmit = (data: KeysToExcelColumnsInput) => {
        handleMapColumnsStep(data);
    };

    const fields = [
        { key: "name", label: "الاسم واللقب", placeholder: "مثال: A", Icon: UserIcon },
        { key: "cin", label: "رقم بطاقة التعريف", placeholder: "", Icon: IdCardIcon },
        { key: "delegation", label: "المندوبية", placeholder: "", Icon: BuildingIcon },
        { key: "section", label: "الشعبة", placeholder: "", Icon: GraduationCapIcon },
        { key: "registrationNumber", label: "رقم التسجيل", placeholder: "", Icon: HashIcon },
        { key: "registrationType", label: "نوع التسجيل", placeholder: "", Icon: FileTextIcon },
        { key: "originalInstitute", label: "المعهد الأصلي", placeholder: "", Icon: SchoolIcon },
        { key: "punishmentReason", label: "سبب العقوبة", placeholder: "", Icon: AlertCircleIcon },
        { key: "violation", label: "العقوبة", placeholder: "", Icon: AlertTriangleIcon },
    ] as const;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6" dir="rtl">
            <div className="text-right space-y-1.5">
                <h3 className="text-lg font-semibold text-foreground">مطابقة أعمدة ملف Excel</h3>
                <p className="text-sm text-muted-foreground">
                    يرجى إدخال حرف العمود المقابل لكل حقل في ملف Excel (مثال: A، B، C...).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((f) => {
                    return (
                        <Controller
                            key={f.key}
                            name={f.key}
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`${f.key}-input`} className="flex items-center gap-1.5">
                                        <f.Icon className="size-3.5 text-muted-foreground" />
                                        {f.label}
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={`${f.key}-input`}
                                        placeholder={f.placeholder}
                                        className="text-right font-semibold uppercase"
                                        value={field.value ?? ""}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    );
                })}
            </div>

            {form.formState.errors.root && (
                <div className="text-destructive text-sm text-right font-medium">
                    {form.formState.errors.root.message === "Excel columns must be unique"
                        ? "يجب أن تكون أحرف الأعمدة فريدة وغير مكررة بين الحقول"
                        : form.formState.errors.root.message}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <Button type="submit" className="px-8">
                    متابعة
                </Button>
            </div>
        </form>
    );
};

export default MapColumns;