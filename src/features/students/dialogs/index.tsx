import { useGetDialogOpen, useGetStudent } from "../store/useDialogStore"
import CreateStudentDialogMain from "./create-student-dialog"
import DeleteAllStudentsDialogMain from "./delete-all-students"
import DeleteStudentDialogMain from "./delete-student-dialog"
import EditStudentDialogMain from "./edit-student-dialog"
import UploadStudentsDialogMain from "./upload-students-dialog"

export const CreateStudentDialog = () => {
    const dialog = useGetDialogOpen()
    if (dialog === 'add') return <CreateStudentDialogMain />
    return null
}


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

export const DeleteAllStudentsDialog = () => {
    const dialog = useGetDialogOpen()
    if (dialog === 'delete-all') return <DeleteAllStudentsDialogMain />
    return null
}