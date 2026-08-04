import { create } from 'zustand';
import type { Student } from '../model/student';

type DialogStore = {
  dialogOpen: 'add' | 'edit' | 'delete' | 'upload' | null;
  setDialogOpen: (dialog: 'add' | 'edit' | 'delete' | 'upload' | null) => void;
  student: Student | null;
  setStudent: (student: Student | null) => void;
};

const useDialogStore = create<DialogStore>((set) => ({
  dialogOpen: null,
  setDialogOpen: (dialog) => set({ dialogOpen: dialog }),
  student: null,
  setStudent: (student) => set({ student: student }),
}));

export const useGetStudent = () => useDialogStore((s) => s.student);
export const useSetStudent = () => useDialogStore((s) => s.setStudent);
export const useGetDialogOpen = () => useDialogStore((s) => s.dialogOpen);
export const useSetDialogOpen = () => useDialogStore((s) => s.setDialogOpen);

export default useDialogStore;
