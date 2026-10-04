



import { DeleteAllStudentsDialog, DeleteStudentDialog, EditStudentDialog, UploadStudentsDialog } from '../dialogs'
import { StudentsTableProvider } from '../provider/student-table-provider'
import StudentsDataTable from './data-table/data-table'

const DataTableLayout = () => {
    return (
        <StudentsTableProvider>
            <StudentsDataTable />
            <EditStudentDialog />
            <DeleteStudentDialog />
            <UploadStudentsDialog />
            <DeleteAllStudentsDialog />
        </StudentsTableProvider>
    )
}

export default DataTableLayout