import type { Student } from '@/features/students/model/student';
import {
  BaseDirectory,
  mkdir,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/plugin-fs';

const FILE_NAME = 'students.json';

async function ensureStorage() {
  await mkdir('', {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });
}

export async function readJson():Promise<Student[]> {
  try {
    const content = await readTextFile(FILE_NAME, {
      baseDir: BaseDirectory.AppData,
    });

    return JSON.parse(content);
  } catch (err) {
    console.error(err);

    await ensureStorage();

    await writeTextFile(
      FILE_NAME,
      JSON.stringify([], null, 2),
      {
        baseDir: BaseDirectory.AppData,
      }
    );

    return [];
  }
}

export async function writeJson(students: Student[]) {
  await writeTextFile(FILE_NAME, JSON.stringify(students, null, 2), {
    baseDir: BaseDirectory.AppData,
  });
}
