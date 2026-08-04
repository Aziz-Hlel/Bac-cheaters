
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useId } from 'react'
import { useStudentsTable } from '../../provider/student-table-provider'


const pageSizeItems = [
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' }
]

const TablePagination = () => {
    const { table, } = useStudentsTable()

    const id = useId()

    return (
        <div className='flex items-center justify-between gap-8'>
            <div className='flex items-center gap-3'>
                <Label htmlFor={id} className='max-sm:sr-only'>
                    عدد الصفوف
                </Label>
                <Select
                    items={pageSizeItems}
                    value={table.getState().pagination.pageSize.toString()}
                    onValueChange={value => {
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger id={id} className='w-fit whitespace-nowrap'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='p-1'>
                        {pageSizeItems.map(item => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='text-muted-foreground flex grow justify-end text-sm whitespace-nowrap'>
                <p className='text-muted-foreground text-sm whitespace-nowrap' aria-live='polite'>
                    <span className='text-foreground'>
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                        {Math.min(
                            Math.max(
                                table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                                table.getState().pagination.pageSize,
                                0
                            ),
                            table.getRowCount()
                        )}
                    </span>
                    من <span className='text-foreground'>{table.getRowCount().toString()}</span>
                </p>
            </div>

            <div>
                <Pagination dir='rtl'>
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                size='icon'
                                variant='outline'
                                className='disabled:pointer-events-none disabled:opacity-50'
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label='Go to first page'
                            >
                                <ChevronFirstIcon className='rotate-180' aria-hidden='true' />
                            </Button>
                        </PaginationItem>

                        <PaginationItem>    
                            <Button
                                size='icon'
                                variant='outline'
                                className='disabled:pointer-events-none disabled:opacity-50'
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label='Go to previous page'
                            >
                                <ChevronLeftIcon className='rotate-180' aria-hidden='true' />
                            </Button>
                        </PaginationItem>

                        <PaginationItem>
                            <Button
                                size='icon'
                                variant='outline'
                                className='disabled:pointer-events-none disabled:opacity-50'
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label='Go to next page'
                            >
                                <ChevronRightIcon className='rotate-180' aria-hidden='true' />
                            </Button>
                        </PaginationItem>

                        <PaginationItem>
                            <Button
                                size='icon'
                                variant='outline'
                                className='disabled:pointer-events-none disabled:opacity-50'
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label='Go to last page'
                            >
                                <ChevronLastIcon className='rotate-180' aria-hidden='true' />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default TablePagination