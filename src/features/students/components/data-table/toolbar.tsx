

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronDownIcon, SearchIcon, Sheet } from 'lucide-react'
import { useId } from 'react'
import { useStudentsTable } from '../../provider/student-table-provider'
import type { SearchKey } from '../../types/searchKey'
import { useSetDialogOpen } from '../../store/useDialogStore'


const searchKeys = [
    {
        code: "name",
        value: "name",
        label: "الاسم واللقب",
    },
    {
        code: "cin",
        value: "cin",
        label: "رقم ب.ت.و",
    },

] as const

const Toolbar = () => {

    const { table, setSearchKey, setGlobalFilter, globalFilter } = useStudentsTable();
    const resetColumnVisivility = () => {
        table.getAllColumns().filter(column => column.getCanHide()).map(column => column.toggleVisibility(true))
    }
    const id = useId()

    const setDialogState = useSetDialogOpen();
    return (
        <div className='flex justify-between gap-2 pb-4 max-sm:flex-col sm:items-center'>
            <div className='flex items-center space-x-2'>


                <div className='w-full max-w-xs space-y-2'>


                    <InputGroup>
                        <InputGroupAddon align='inline-start'>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='text-muted-foreground focus-visible:ring-ring/50 rounded-l-none hover:bg-transparent'
                            >
                                <SearchIcon />
                                <span className='sr-only'>بحث</span>
                            </Button>
                        </InputGroupAddon>
                        <InputGroupInput id={id} placeholder='بحث...' value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
                        <Select items={searchKeys} defaultValue={searchKeys[0].value} onValueChange={(value) => setSearchKey(value as SearchKey)}>
                            <SelectTrigger id={id} className=" rounded-r-none ">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {searchKeys.map(item => (
                                    <SelectItem key={item.code} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </InputGroup>

                </div>
            </div>
            <div className='flex items-center gap-2'>

                <Button onClick={() => setDialogState('upload')} className=" flex bg-green-600 hover:bg-green-600/80 "> <Sheet /> <span className="  "> تحميل التلامذة </span></Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant='outline' size='sm' className='mr-auto'>
                            <span className='text-right'>
                                عرض الأعمدة
                            </span>
                            <ChevronDownIcon className='mr-1 size-4 ' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                Visible Columns
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            {table
                                .getAllColumns()
                                .filter(column => column.getCanHide())
                                .map(column => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)

                                        }
                                    >
                                        {typeof column.columnDef.header === "string"
                                            ? <Label>{column.columnDef.header}</Label>
                                            : column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            <Button variant='secondary' className='w-full' onClick={resetColumnVisivility}>Reset</Button>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default Toolbar