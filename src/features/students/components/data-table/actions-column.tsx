import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Row } from '@tanstack/react-table';
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import React, { Fragment } from 'react';
import type { Student } from '../../model/student';
import { useSetDialogState, useSetStudent } from '../../store/useDialogStore';

type RowAction = {
  key: 'edit' | 'delete';
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};


const ActionsColumn = ({ row }: { row: Row<Student> }) => {
  const setStudent = useSetStudent();
  const setDialogOpen = useSetDialogState();


  const actions: RowAction[] = [
    {
      key: 'edit',
      label: 'تعديل',
      icon: <SquarePen size={16} className='text-green-500 ' />,
      onClick: () => {
        setStudent(row.original);
        setDialogOpen('edit');
      }
    },

    {
      key: 'delete',
      label: 'حذف',
      icon: <Trash2 size={16} className='text-red-500 ' />,
      onClick: () => {
        setStudent(row.original);
        setDialogOpen('delete');
      }
    },
  ]


  return (
    <>
      <div className='justify-end ps-0'>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex justify-center'>
            <Button variant='ghost' className='data-[state=open]:bg-muted flex h-fit p-0 has-[>svg]:px-0'>
              <EllipsisVertical className='size-4 rotate-90 cursor-pointer rounded-full hover:bg-gray-200' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-40'>
            {actions.map((action) => (
              <Fragment key={action.key}>
                <DropdownMenuItem onClick={action.onClick} className="flex  ">
                  <span>{action.label}</span>
                  <DropdownMenuShortcut className='flex flex-1 justify-end items-end'>
                    {action.icon}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default ActionsColumn;
