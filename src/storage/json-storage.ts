import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";
import type { Student } from "@/features/students/model/student";

async function getDbPath() {
  const dir = await appDataDir();

  return `${dir}/students.json`;
}

export async function readJson(): Promise<Student[]> {
  const path = await getDbPath();

  try {
    const content = await readTextFile(path);

    return JSON.parse(content);
  } catch {
    await writeTextFile(path, JSON.stringify([], null, 2));

    return [];
  }
}

export async function writeJson(students: Student[]) {
  const path = await getDbPath();

  await writeTextFile(path, JSON.stringify(students, null, 2));
}
