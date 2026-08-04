import type { Student } from "@/features/students/model/student";
import { readJson, writeJson } from "@/storage/json-storage";

async function getStudents() {
  const students = await readJson();

  return students;
}

export async function getAll() {
  return getStudents();
}

export async function getById(id: string) {
  const students = await getStudents();

  return students.find((student) => student.id === id);
}

export async function create(input: Omit<Student, "createdAt">) {
  const students = await getStudents();

  const student: Student = {
    createdAt: new Date().toISOString(),

    ...input,
  };

  students.push(student);

  await writeJson(students);

  return student;
}

export async function update(id: string, data: Partial<Student>) {
  const students = await getStudents();

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) throw new Error("Student not found");

  students[index] = {
    ...students[index],

    ...data,

    id,
  };

  await writeJson(students);

  return students[index];
}

export async function remove(id: string) {
  const students = await getStudents();

  const filtered = students.filter((s) => s.id !== id);

  await writeJson(filtered);
}
