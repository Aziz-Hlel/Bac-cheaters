import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import queryClient from "@/config/react-qeury";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useState } from 'react';
import { toast } from "sonner";
import { useStudents } from "../hooks/useStudents";
import { useSetDialogState } from "../store/useDialogStore";


const DeleteAllStudentsDialogMain = () => {
    const [confirmText, setConfirmText] = useState('');
    const { deleteAllStudents, students } = useStudents();
    const count = students.length;
    const setDialogState = useSetDialogState();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => deleteAllStudents(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });

    const handleDeleteAllStudents = async () => {
        if (confirmText !== 'حذف') return;

        try {
            await mutateAsync();
            setDialogState(null);
            toast.success("تم حذف جميع السجلات بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء حذف السجلات", {
                description: typeof error === 'string' ? error : (error as Error)?.message || "خطأ غير معروف"
            });
        }
    };

    const handleCancel = () => {
        setDialogState(null);
    };

    const isConfirmed = confirmText === 'حذف';
    const hasTyped = confirmText.length > 0;

    return (
        <Dialog open onOpenChange={handleCancel}>
            <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
                {/* Danger banner */}
                <div
                    className="relative flex flex-col items-center justify-center gap-3 py-8 px-6"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 0%, color-mix(in oklch, var(--destructive) 18%, transparent) 0%, transparent 70%)',
                        borderBottom: '1px solid color-mix(in oklch, var(--destructive) 20%, var(--border))',
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        <div
                            className="relative z-10 flex items-center justify-center size-14 rounded-full shadow-lg"
                            style={{
                                background: 'color-mix(in oklch, var(--destructive) 15%, var(--card))',
                                border: '1.5px solid color-mix(in oklch, var(--destructive) 35%, transparent)',
                            }}
                        >
                            <AlertTriangle
                                className="size-7"
                                style={{ color: 'var(--destructive)' }}
                            />
                        </div>
                    </div>

                    <DialogHeader className="text-center items-center space-y-1 mt-1">
                        <DialogTitle className="text-xl font-bold">حذف جميع السجلات</DialogTitle>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                            لا يمكن التراجع عن هذا الإجراء بعد التأكيد
                        </p>
                    </DialogHeader>
                </div>

                {/* Body */}
                <div className="px-6 pt-5 pb-6 space-y-5">
                    {/* Count badge */}
                    <div
                        className="flex items-center gap-3 rounded-lg px-4 py-3"
                        style={{
                            background: 'color-mix(in oklch, var(--destructive) 8%, var(--muted))',
                            border: '1px solid color-mix(in oklch, var(--destructive) 20%, var(--border))',
                        }}
                    >
                        <Trash2 className="size-4 shrink-0" style={{ color: 'var(--destructive)' }} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                                سيتم حذف{' '}
                                <span
                                    className="font-bold text-base"
                                    style={{ color: 'var(--destructive)' }}
                                >
                                    {count}
                                </span>{' '}
                                سجل طالب نهائياً
                            </p>
                        </div>
                    </div>

                    {/* Confirmation input */}
                    <div className="space-y-2">
                        <Label htmlFor="confirm-delete" className="text-sm font-medium">
                            لتأكيد الحذف، اكتب{' '}
                            <span
                                className="font-bold px-1.5 py-0.5 rounded text-xs"
                                style={{
                                    color: 'var(--destructive)',
                                    background: 'color-mix(in oklch, var(--destructive) 10%, transparent)',
                                    border: '1px solid color-mix(in oklch, var(--destructive) 25%, transparent)',
                                }}
                            >
                                حذف
                            </span>{' '}
                            في الحقل أدناه:
                        </Label>
                        <Input
                            id="confirm-delete"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="اكتب حذف هنا..."
                            autoComplete="off"
                            dir="rtl"
                            style={{
                                outline: 'none',
                                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                                borderColor: isConfirmed
                                    ? 'oklch(0.6 0.2 142)'
                                    : hasTyped
                                        ? 'color-mix(in oklch, var(--destructive) 60%, transparent)'
                                        : undefined,
                                boxShadow: isConfirmed
                                    ? '0 0 0 2px oklch(0.6 0.2 142 / 0.2)'
                                    : hasTyped
                                        ? '0 0 0 2px color-mix(in oklch, var(--destructive) 20%, transparent)'
                                        : undefined,
                            }}
                        />
                        {hasTyped && !isConfirmed && (
                            <p className="text-xs" style={{ color: 'var(--destructive)' }}>
                                يرجى كتابة &quot;حذف&quot; بشكل صحيح للمتابعة
                            </p>
                        )}
                        {isConfirmed && (
                            <p className="text-xs" style={{ color: 'oklch(0.6 0.2 142)' }}>
                                ✓ تم التحقق، يمكنك الآن تأكيد الحذف
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1"
                            disabled={isPending}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteAllStudents}
                            disabled={!isConfirmed || isPending}
                            className="flex-1 gap-2 transition-all duration-200"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    جاري الحذف...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-4" />
                                    تأكيد الحذف
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAllStudentsDialogMain;