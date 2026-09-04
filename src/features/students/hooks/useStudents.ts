import { useMemo } from 'react';

import type { CreateStudentInput, Student, StudentWithScore } from '@/features/students/model/student';
import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import * as repository from '../repo/repository';
import type { SearchKey } from '../types/searchKey';

export function useStudents() {
  const studentQuery = useQuery({
    queryKey: ['students'],
    queryFn: repository.getAll,
    enabled: true,
    throwOnError: true,
  });

  const students: Student[] = useMemo(() => studentQuery.data || [], [studentQuery.data]);

  const cinFuse = useMemo(
    () =>
      new Fuse(students, {
        keys: ['cin'],
        threshold: 0.6,
        includeScore: true,
      }),
    [students],
  );

  async function addStudents(students: CreateStudentInput[]) {
    await repository.createMany(students);
  }

  async function deleteStudent(id: string) {
    await repository.remove(id);
  }

  async function deleteAllStudents() {
    await repository.removeAll();
  }

  async function editStudent(id: string, data: Partial<Student>) {
    await repository.update(id, data);
  }

  function searchStudents(query: string, searchKey: SearchKey): StudentWithScore[] {
    const fuse = searchKey === 'name' ? cinFuse : cinFuse;

    const queryResult = fuse.search(query);

    const resultWithScore = queryResult.map((item) => ({
      ...item.item,
      score: 0,
    }));

    return resultWithScore;
  }

  return {
    students,

    addStudents,

    deleteStudent,

    editStudent,

    searchStudents,

    deleteAllStudents,
  };
}
