'use client'

import type { CSSProperties } from 'react'
import { useId } from 'react'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Cell, Header } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react'

import type { Student } from '../../model/student'
import { useStudentsTable } from '../../provider/student-table-provider'
import { columns } from './columns-definition'
import TablePagination from './pagination'
import Toolbar from './toolbar'


const DraggableColumnDataTableDemo = () => {


    const { table, columnOrder, setColumnOrder } = useStudentsTable()

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active && over && active.id !== over.id) {
            setColumnOrder(columnOrder => {
                const oldIndex = columnOrder.indexOf(active.id as string)
                const newIndex = columnOrder.indexOf(over.id as string)

                return arrayMove(columnOrder, oldIndex, newIndex)
            })
        }
    }

    const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))



    return (
        <div className='w-full flex flex-col gap-4 py-4'>
            <Toolbar />
            <div className='rounded-md border'>
                <DndContext
                    id={useId()}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToHorizontalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <Table>
                        <TableHeader className=''>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id} className='bg-muted/50 [&>th]:border-t-0'>
                                    <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                                        {headerGroup.headers.map(header => (
                                            <DraggableTableHeader key={header.id} header={header} />
                                        ))}
                                    </SortableContext>
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map(cell => (
                                            <SortableContext key={cell.id} items={columnOrder} strategy={horizontalListSortingStrategy}>
                                                <DragAlongCell key={cell.id} cell={cell} />
                                            </SortableContext>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            <TablePagination />
        </div>
    )
}

const DraggableTableHeader = ({ header }: { header: Header<Student, unknown> }) => {
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
        id: header.column.id
    })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition,
        whiteSpace: 'nowrap',
        width: header.column.getSize(),
        zIndex: isDragging ? 1 : 0
    }

    return (
        <TableHead
            ref={setNodeRef}
            className='before:bg-border bg-muted/50 relative h-10 border-t before:absolute before:inset-y-0 before:left-0 before:w-px first:before:bg-transparent'
            style={style}
            aria-sort={
                header.column.getIsSorted() === 'asc'
                    ? 'ascending'
                    : header.column.getIsSorted() === 'desc'
                        ? 'descending'
                        : 'none'
            }
        >
            <div className='flex items-center justify-start gap-0.5'>
                <Button
                    size='icon'
                    variant='ghost'
                    className='-ml-2 size-7 cursor-grab'
                    {...attributes}
                    {...listeners}
                    aria-label='Drag to reorder'
                >
                    <GripVerticalIcon className='opacity-60' aria-hidden='true' />
                </Button>
                <span className='grow truncate'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </span>
                {header.column.getCanSort() && <Button
                    size='icon'
                    variant='ghost'
                    className='group -mr-1 size-7'
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={e => {
                        if (header.column.getCanSort() && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                        }
                    }}
                    aria-label='Toggle sorting'
                >
                    {{
                        asc: (
                            <ChevronUpIcon className='shrink-0 opacity-60' size={16} aria-hidden='true' />
                        ),
                        desc: (
                            <ChevronDownIcon className='shrink-0 opacity-60' size={16} aria-hidden='true' />
                        )
                    }[header.column.getIsSorted() as string] ?? (
                            <ChevronUpIcon className='shrink-0 opacity-0 group-hover:opacity-60' size={16} aria-hidden='true' />
                        )}
                </Button>}
            </div>
        </TableHead>
    )
}

const DragAlongCell = ({ cell }: { cell: Cell<Student, unknown> }) => {
    const { isDragging, setNodeRef, transform, transition } = useSortable({
        id: cell.column.id
    })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition,
        width: cell.column.getSize(),
        zIndex: isDragging ? 1 : 0
    }

    return (
        <TableCell ref={setNodeRef} className='truncate ps-4' style={style}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
    )
}

export default DraggableColumnDataTableDemo
