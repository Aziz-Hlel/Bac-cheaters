


import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import queryClient from '@/config/react-qeury'
import { useMutation } from '@tanstack/react-query'
import { useStudents } from '../hooks/useStudents'
import type { Student } from '../model/student'
import { useSetDialogState } from '../store/useDialogStore'

const DeleteStudentDialogMain = ({ student }: { student: Student }) => {

    const setDialogOpen = useSetDialogState()
    const { deleteStudent } = useStudents();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => deleteStudent(id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['students'] }); }
    })

    const handleCancel = () => {
        setDialogOpen(null)
    }

    const handleDelete = async () => {
        try {
            await mutateAsync(student.id);
            toast.add({
                title: "تم حذف الطالب",
                type: "success",
            })
            setDialogOpen(null)
        } catch (error) {
            toast.add({
                title: "حدث خطأ أثناء حذف الطالب",
                type: "error",
                description: error instanceof Error ? error.message : "حدث خطأ غير معروف",
            })
        }
    }



    return (
        <AlertDialog open={true} onOpenChange={handleCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>حذف طالب</AlertDialogTitle>
                    <AlertDialogDescription>هل انت متاكد من حذف هذا الطالب؟</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
                        الغاء
                    </AlertDialogCancel>
                    <Button onClick={handleDelete} disabled={isPending} className='bg-red-600 hover:bg-red-500'>
                        حذف
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>)
}

export default DeleteStudentDialogMain