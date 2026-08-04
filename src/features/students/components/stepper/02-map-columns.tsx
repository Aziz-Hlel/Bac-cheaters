import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { keysToExcelColumnsSchema, type KeysToExcelColumnsInput } from "../../schemas/keysToExcelColumns";
import {
    User as UserIcon,
    IdCard as IdCardIcon,
    Building2 as BuildingIcon,
    GraduationCap as GraduationCapIcon,
    Hash as HashIcon,
    FileText as FileTextIcon,
    School as SchoolIcon,
    AlertCircle as AlertCircleIcon,
    AlertTriangle as AlertTriangleIcon,
} from "lucide-react";

interface MapColumnsProps {
    handleMapColumnsStep: (columns: KeysToExcelColumnsInput) => void;
}

const MapColumns = ({ handleMapColumnsStep }: MapColumnsProps) => {
    const form = useForm<KeysToExcelColumnsInput>({
        resolver: zodResolver(keysToExcelColumnsSchema),
        defaultValues: {
            cin: "",
            name: "",
            delegation: "",
            section: "",
            registrationNumber: "",
            registrationType: "",
            originalInstitute: "",
            punishmentReason: "",
            violation: "",
        }
    });

    const onSubmit = (data: KeysToExcelColumnsInput) => {
        handleMapColumnsStep(data);
    };

    const fields = [
        { key: "name", label: "الاسم واللقب", placeholder: "مثال: A", Icon: UserIcon },
        { key: "cin", label: "رقم بطاقة التعريف", placeholder: "مثال: B", Icon: IdCardIcon },
        { key: "delegation", label: "المندوبية", placeholder: "مثال: C", Icon: BuildingIcon },
        { key: "section", label: "الشعبة", placeholder: "مثال: D", Icon: GraduationCapIcon },
        { key: "registrationNumber", label: "رقم التسجيل", placeholder: "مثال: E", Icon: HashIcon },
        { key: "registrationType", label: "نوع التسجيل", placeholder: "مثال: F", Icon: FileTextIcon },
        { key: "originalInstitute", label: "المعهد الأصلي", placeholder: "مثال: G", Icon: SchoolIcon },
        { key: "punishmentReason", label: "سبب العقوبة", placeholder: "مثال: H", Icon: AlertCircleIcon },
        { key: "violation", label: "العقوبة", placeholder: "مثال: I", Icon: AlertTriangleIcon },
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