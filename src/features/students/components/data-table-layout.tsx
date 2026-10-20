



import { CreateStudentDialog, DeleteAllStudentsDialog, DeleteStudentDialog, EditStudentDialog, UploadStudentsDialog } from '../dialogs'
import { StudentsTableProvider } from '../provider/student-table-provider'
import StudentsDataTable from './data-table/data-table'

const DataTableLayout = () => {
    return (
        <StudentsTableProvider>
            <StudentsDataTable />
            <CreateStudentDialog />
            <EditStudentDialog />
            <DeleteStudentDialog />
            <UploadStudentsDialog />
            <DeleteAllStudentsDialog />
        </StudentsTableProvider>
    )
}

export default DataTableLayout