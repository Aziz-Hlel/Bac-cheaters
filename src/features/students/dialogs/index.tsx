import { useGetDialogOpen, useGetStudent } from "../store/useDialogStore"
import DeleteStudentDialogMain from "./delete-student-dialog"
import EditStudentDialogMain from "./edit-student-dialog"


export const EditStudentDialog = () => {
    const dialog = useGetDialogOpen()
    const student = useGetStudent()
    if (dialog === 'edit' && student) return <EditStudentDialogMain student={student} />
    return null
}


export const DeleteStudentDialog = () => {
    const dialog = useGetDialogOpen()
    const student = useGetStudent()
    if (dialog === 'delete' && student) return <DeleteStudentDialogMain student={student} />
    return null
}