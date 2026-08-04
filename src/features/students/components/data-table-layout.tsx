



import { DeleteStudentDialog, EditStudentDialog } from '../dialogs'
import { StudentsTableProvider } from '../provider/student-table-provider'
import DraggableColumnDataTableDemo from './data-table/data-table'

const DataTableLayout = () => {
    return (
        <StudentsTableProvider>
            <DraggableColumnDataTableDemo />
            <EditStudentDialog />
            <DeleteStudentDialog />
        </StudentsTableProvider>
    )
}

export default DataTableLayout