import { useGetDialogOpen, useGetStudent } from "../store/useDialogStore"
import DeleteStudentDialogMain from "./delete-student-dialog"
import EditStudentDialogMain from "./edit-student-dialog"
import UploadStudentsDialogMain from "./upload-students-dialog"


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

export const UploadStudentsDialog = () => {
    const dialog = useGetDialogOpen()
    if (dialog === 'upload') return <UploadStudentsDialogMain />
    return null
}