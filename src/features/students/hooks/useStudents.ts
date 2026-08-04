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
  });

  const students: Student[] = useMemo(() => studentQuery.data || [], [studentQuery.data]);

  const nameFuse = useMemo(
    () =>
      new Fuse(students, {
        keys: ['name'],
        threshold: 0.3,
        includeScore: true,
      }),
    [students],
  );

  const cinFuse = useMemo(
    () =>
      new Fuse(students, {
        keys: ['cin'],
        threshold: 0.3,
        includeScore: true,
      }),
    [students],
  );

  async function addStudent(student: CreateStudentInput) {
    await repository.create(student);
  }

  async function deleteStudent(id: string) {
    await repository.remove(id);
  }

  async function editStudent(id: string, data: Partial<Student>) {
    await repository.update(id, data);
  }

  function searchStudents(query: string, searchKey: SearchKey): StudentWithScore[] {
    const fuse = searchKey === 'name' ? nameFuse : cinFuse;

    const queryResult = fuse.search(query);

    const resultWithScore = queryResult.map((item) => ({
      ...item.item,
      score: item.score,
    }));

    return resultWithScore;
  }

  return {
    students,

    addStudent,

    deleteStudent,

    editStudent,

    searchStudents,
  };
}
