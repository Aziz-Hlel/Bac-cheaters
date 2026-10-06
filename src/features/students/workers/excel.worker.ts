import * as Comlink from 'comlink';
import * as XLSX from 'xlsx';
import type { CreateStudentInput } from '../model/student';
import type { KeysToExcelColumnsInput } from '../schemas/keysToExcelColumns';

export interface ExtractStudentsParams {
  sheetNumber: number;
  schoolYear: number;
  firstRow: number;
  lastRow: number;
  columns: KeysToExcelColumnsInput;
  violationsDuration: Record<string, number | null>;
}

export interface PreviewRowsResult {
  activeKeys: (keyof KeysToExcelColumnsInput)[];
  previewRows: {
    first3: Record<string, unknown>[];
    last3: Record<string, unknown>[];
  };
  isOverlap: boolean;
}

export interface UniqueViolationsResult {
  uniqueViolationsWithDuration: { text: string; value: number | null }[];
  emptyCells: string[];
}

export class ExcelWorker {
  private cachedWorkbook: XLSX.WorkBook | null = null;

  private extractDurationFromViolationText(text: string): number | null {
    const normalized = text.trim().replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

    const match = normalized.match(/\d+/);
    if (match) {
      return Number(match[0]);
    }

    if (normalized.includes('سنة')) {
      return 1;
    }

    if (normalized.includes('سنتين') || normalized.includes('سنتان')) {
      return 2;
    }

    return null;
  }

  private getSheet(sheetNumber: number): XLSX.WorkSheet {
    if (!this.cachedWorkbook) {
      throw new Error('Workbook is not loaded in worker');
    }

    const sheetName = this.cachedWorkbook.SheetNames[sheetNumber] || this.cachedWorkbook.SheetNames[0];
    const sheet = this.cachedWorkbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error(`Sheet ${sheetNumber} not found`);
    }

    return sheet;
  }

  public loadWorkbook(buffer: ArrayBuffer): string[] {
    this.cachedWorkbook = XLSX.read(buffer, {
      type: 'array',
    });
    return this.cachedWorkbook.SheetNames;
  }

  public getUniqueViolations(
    sheetNumber: number,
    violationColumn: string,
    firstRow: number,
    lastRow: number,
  ): UniqueViolationsResult {
    const sheet = this.getSheet(sheetNumber);

    const values = new Set<string>();
    const emptyCells: string[] = [];

    for (let row = firstRow; row <= lastRow; row++) {
      const cellAddress = `${violationColumn}${row}`;
      const cellValue = sheet[cellAddress]?.v;

      const isEmpty =
        cellValue === undefined || cellValue === null || (typeof cellValue === 'string' && cellValue.trim() === '');

      if (isEmpty) {
        emptyCells.push(cellAddress);
        continue;
      }

      values.add(String(cellValue).trim());
    }

    const violationWithDuration: { text: string; value: number | null }[] = [];
    values.forEach((violation) => {
      violationWithDuration.push({
        text: violation,
        value: this.extractDurationFromViolationText(violation),
      });
    });

    return {
      uniqueViolationsWithDuration: violationWithDuration,
      emptyCells,
    };
  }

  public getPreviewRows(
    sheetNumber: number,
    columns: KeysToExcelColumnsInput,
    firstRow: number,
    lastRow: number,
  ): PreviewRowsResult {
    const sheet = this.getSheet(sheetNumber);

    const keys = (Object.keys(columns) as (keyof KeysToExcelColumnsInput)[]).filter((key) => Boolean(columns[key]));

    const totalRows = lastRow - firstRow + 1;
    const first3RowIndexes: number[] = [];
    for (let i = 0; i < Math.min(3, totalRows); i++) {
      first3RowIndexes.push(firstRow + i);
    }

    const last3RowIndexes: number[] = [];
    for (let i = Math.max(0, totalRows - 3); i < totalRows; i++) {
      const rowNum = firstRow + i;
      if (!first3RowIndexes.includes(rowNum)) {
        last3RowIndexes.push(rowNum);
      }
    }

    const getRowData = (rowNum: number): Record<string, unknown> => {
      const rowObj: Record<string, unknown> = { rowNum };
      keys.forEach((key) => {
        const colLetter = columns[key];
        if (colLetter) {
          const cellAddress = `${colLetter}${rowNum}`;
          const val = sheet[cellAddress]?.v;
          rowObj[key] = val !== undefined && val !== null ? String(val).trim() : '';
        }
      });
      return rowObj;
    };

    const first3 = first3RowIndexes.map(getRowData);
    const last3 = last3RowIndexes.map(getRowData);
    const isOverlap = first3RowIndexes.length + last3RowIndexes.length >= totalRows;

    return {
      activeKeys: keys,
      previewRows: { first3, last3 },
      isOverlap,
    };
  }

  public async extractStudents(
    params: ExtractStudentsParams,
    onProgress?: (processed: number, total: number) => void,
  ): Promise<CreateStudentInput[]> {
    const { sheetNumber, schoolYear, firstRow, lastRow, columns, violationsDuration } = params;

    const sheet = this.getSheet(sheetNumber);

    const total = lastRow - firstRow + 1;
    const extractedStudents: CreateStudentInput[] = [];
    let processed = 0;

    for (let rowNum = firstRow; rowNum <= lastRow; rowNum++) {
      const getCellValue = (key: keyof KeysToExcelColumnsInput): string | null => {
        const colLetter = columns[key];
        if (!colLetter) return null;
        const cellAddress = `${colLetter}${rowNum}`;
        const cellVal = sheet[cellAddress]?.v;
        if (cellVal === undefined || cellVal === null) return null;
        const strVal = String(cellVal).trim();
        return strVal !== '' ? strVal : null;
      };

      const violationVal = getCellValue('violation');
      let duration: number | null = null;
      if (violationVal !== null && violationsDuration[violationVal] !== undefined) {
        duration = violationsDuration[violationVal];
      }

      const studentRecord: CreateStudentInput = {
        id: crypto.randomUUID(),
        schoolYear,
        cin: getCellValue('cin'),
        name: getCellValue('name'),
        delegation: getCellValue('delegation'),
        section: getCellValue('section'),
        registrationNumber: getCellValue('registrationNumber'),
        registrationType: getCellValue('registrationType'),
        originalInstitute: getCellValue('originalInstitute'),
        punishmentReason: getCellValue('punishmentReason'),
        violation: violationVal,
        punishmentDuration: duration,
      };

      extractedStudents.push(studentRecord);
      processed++;

      // Throttle progress notifications every 100 rows or on the last row
      if (onProgress && (processed % 100 === 0 || processed === total)) {
        try {
          await onProgress(processed, total);
        } catch {
          // Ignore callback communication errors to avoid aborting extraction
        }
      }
    }

    return extractedStudents;
  }

  public reset(): void {
    this.cachedWorkbook = null;
  }
}
const excelWorker = new ExcelWorker();

Comlink.expose(excelWorker);

