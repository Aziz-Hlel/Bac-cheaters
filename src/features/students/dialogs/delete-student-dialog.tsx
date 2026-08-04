


import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import queryClient from '@/config/react-qeury'
import { useMutation } from '@tanstack/react-query'
import { useStudents } from '../hooks/useStudents'
import type { Student } from '../model/student'
import { useSetDialogOpen } from '../store/useDialogStore'

const DeleteStudentDialogMain = ({ student }: { student: Student }) => {

    const setDialogOpen = useSetDialogOpen()
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
                title: "Student deleted",
                type: "success",
            })
            setDialogOpen(null)
        } catch (error) {
            toast.add({
                title: "Error deleting student",
                type: "error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
            })
        }
    }



    return (
        <AlertDialog open={true} onOpenChange={handleCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Exam Schedule</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this exam schedule?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <Button onClick={handleDelete} disabled={isPending} className='bg-red-600 hover:bg-red-500'>
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>)
}

export default DeleteStudentDialogMain