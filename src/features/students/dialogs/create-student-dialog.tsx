import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import queryClient from "@/config/react-qeury";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
    AlertTriangleIcon,
    BookOpenIcon,
    BuildingIcon,
    CalendarIcon,
    ClipboardListIcon,
    FileTextIcon,
    HashIcon,
    IdCardIcon,
    UserIcon,
    UserPlusIcon,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import type { CreateStudentInput } from "../model/student";
import { createStudentSchema } from "../model/student";
import { create } from "../repo/repository";
import { useSetDialogState } from "../store/useDialogStore";

const SCHOOL_YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);
const PUNISHMENT_YEARS = Array.from({ length: 10 }, (_, i) => i);

interface SectionHeadingProps {
    icon: React.ReactNode;
    label: string;
    accent?: string;
}

function SectionHeading({ icon, label, accent = "from-emerald-500 to-teal-600" }: SectionHeadingProps) {
    return (
        <div className="flex items-center gap-2.5 py-1">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br ${accent} text-white shadow-sm`}>
                {icon}
            </div>
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <div className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
        </div>
    );
}

const CreateStudentDialogMain = () => {
    const setDialogOpen = useSetDialogState();

    const form = useForm<CreateStudentInput>({
        resolver: zodResolver(createStudentSchema),
        defaultValues: {
            id: crypto.randomUUID(),
            name: "",
            cin: "",
            delegation: "",
            section: "",
            schoolYear: 2025,
            registrationNumber: "",
            registrationType: "",
            originalInstitute: "",
            punishmentDuration: null,
            punishmentReason: "",
            violation: "",
            notes: "",
        },
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: CreateStudentInput) => create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
            setDialogOpen(null);
        },
    });

    const onSubmit = async (data: CreateStudentInput) => {
        try {
            const payload: CreateStudentInput = {
                ...data,
                id: data.id || crypto.randomUUID(),
            };
            await mutateAsync(payload);
            toast.add({
                title: "تمت إضافة التلميذ",
                description: "تمت إضافة بيانات التلميذ بنجاح",
                type: "success",
            });
        } catch (error) {
            toast.add({
                title: "فشل إضافة التلميذ",
                description: error instanceof Error ? error.message : "حدث خطأ غير معروف",
                type: "error",
            });
        }
    };

    const handleCancel = () => {
        setDialogOpen(null);
    };

    return (
        <Dialog open onOpenChange={handleCancel}>
            <DialogContent className="min-w-2xl gap-0 p-0 overflow-hidden">
                <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 px-6 py-5">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute -right-2 top-10 h-16 w-16 rounded-full bg-white/5" />

                    <DialogHeader className="ms-4">
                        <DialogTitle className="flex items-center gap-2.5 text-white">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                                <UserPlusIcon className="size-5" />
                            </div>
                            <div>
                                <p className="text-base font-semibold leading-tight">إضافة تلميذ جديد</p>
                                <p className="mt-0.5 text-xs font-normal text-white/80">
                                    إدخال بيانات التلميذ وسجله التأديبي
                                </p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    <div className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-6">
                        <div className="space-y-4">
                            <SectionHeading
                                icon={<UserIcon className="size-3.5" />}
                                label="المعلومات الشخصية"
                                accent="from-emerald-500 to-teal-600"
                            />

                            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-name-input">
                                                <UserIcon className="size-3.5 text-muted-foreground" />
                                                الاسم واللقب
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-name-input"
                                                placeholder="مثال: أحمد بن علي"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="cin"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-cin-input">
                                                <IdCardIcon className="size-3.5 text-muted-foreground" />
                                                رقم بطاقة التعريف
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-cin-input"
                                                placeholder="مثال: 12345678"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="delegation"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-delegation-input">
                                                <BuildingIcon className="size-3.5 text-muted-foreground" />
                                                المندوبية
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-delegation-input"
                                                placeholder="مثال: تونس"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="section"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-section-input">
                                                <BookOpenIcon className="size-3.5 text-muted-foreground" />
                                                الشعبة
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-section-input"
                                                placeholder="مثال: العلوم"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="schoolYear"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                <CalendarIcon className="size-3.5 text-muted-foreground" />
                                                سنة الدورة
                                            </FieldLabel>
                                            <Select
                                                value={field.value != null ? String(field.value) : ""}
                                                onValueChange={(v) => field.onChange(Number(v))}
                                            >
                                                <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                                    <span>
                                                        {field.value ? `دورة ${field.value}` : "اختر السنة..."}
                                                    </span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SCHOOL_YEARS.map((yr) => (
                                                        <SelectItem key={yr} value={String(yr)}>
                                                            دورة {yr}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </div>

                        <div className="space-y-4">
                            <SectionHeading
                                icon={<ClipboardListIcon className="size-3.5" />}
                                label="بيانات التسجيل"
                                accent="from-sky-500 to-blue-600"
                            />

                            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="registrationNumber"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-registrationNumber-input">
                                                <HashIcon className="size-3.5 text-muted-foreground" />
                                                رقم التسجيل
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-registrationNumber-input"
                                                placeholder="مثال: 2024-001"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="registrationType"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-registrationType-input">
                                                <ClipboardListIcon className="size-3.5 text-muted-foreground" />
                                                نوع التسجيل
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-registrationType-input"
                                                placeholder="مثال: جديد / تحويل"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="originalInstitute"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-originalInstitute-input">
                                                <BuildingIcon className="size-3.5 text-muted-foreground" />
                                                المعهد الأصلي
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-originalInstitute-input"
                                                placeholder="مثال: المعهد النموذجي بتونس"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </div>

                        <div className="space-y-4">
                            <SectionHeading
                                icon={<AlertTriangleIcon className="size-3.5" />}
                                label="السجل التأديبي"
                                accent="from-rose-500 to-red-600"
                            />

                            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="violation"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-violation-input">
                                                <AlertTriangleIcon className="size-3.5 text-muted-foreground" />
                                                العقوبة
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-violation-input"
                                                placeholder="صف العقوبة..."
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="punishmentReason"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="create-punishmentReason-input">
                                                <ClipboardListIcon className="size-3.5 text-muted-foreground" />
                                                سبب العقوبة
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="create-punishmentReason-input"
                                                placeholder="سبب العقوبة..."
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="punishmentDuration"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                <CalendarIcon className="size-3.5 text-muted-foreground" />
                                                مدة العقوبة
                                            </FieldLabel>
                                            <Select
                                                value={field.value != null ? String(field.value) : ""}
                                                onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                                            >
                                                <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                                    <SelectValue placeholder="اختر مدة العقوبة..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PUNISHMENT_YEARS.map((yr) => (
                                                        <SelectItem key={yr} value={String(yr)}>
                                                            {yr}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </div>

                        <div className="space-y-4">
                            <SectionHeading
                                icon={<FileTextIcon className="size-3.5" />}
                                label="ملاحظات"
                                accent="from-amber-500 to-orange-600"
                            />

                            <FieldGroup className="grid grid-cols-1 gap-4">
                                <Controller
                                    name="notes"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Textarea
                                                {...field}
                                                id="create-notes-input"
                                                placeholder="أضف ملاحظات..."
                                                value={field.value ?? ""}
                                                rows={3}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </div>
                    </div>

                    <DialogFooter className="m-0 flex flex-row items-center justify-end gap-3 border-t bg-muted/50 px-6 py-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            إلغاء
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 border-0"
                        >
                            {isPending ? (
                                <>
                                    <Spinner /> جاري الحفظ...
                                </>
                            ) : (
                                "إضافة التلميذ"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateStudentDialogMain;