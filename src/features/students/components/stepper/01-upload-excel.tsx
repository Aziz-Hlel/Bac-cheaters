import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { toast } from '@/components/ui/toast';
import { Check, Loader2, Upload, X } from 'lucide-react';
import * as React from 'react';

import { Separator } from '@/components/ui/separator';
import * as Comlink from 'comlink';
import { useExcelWorker } from '../../context/excel-worker-context';

interface UploadExcelProps {
  handleUploadStep: (file: File, sheetNumber: number) => void;
}

export function UploadExcel({ handleUploadStep }: UploadExcelProps) {
  const { worker, resetWorker } = useExcelWorker();
  const [files, setFiles] = React.useState<File[]>([]);
  const [sheetNames, setSheetNames] = React.useState<string[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = React.useState<number | null>(null);
  const [isLoadingSheets, setIsLoadingSheets] = React.useState<boolean>(false);
  const MAX_SIZE = 50 * 1024 * 1024;

  const onFileValidate = React.useCallback((file: File): string | null => {
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    const isExcelFile =
      allowedMimeTypes.includes(file.type) || file.name.endsWith('.xls') || file.name.endsWith('.xlsx');

    if (!isExcelFile) {
      return 'Only Excel files (.xls, .xlsx) are allowed';
    }

    return null;
  }, []);

  const onFileReject = React.useCallback(
    (file: File) => {
      if (file.size > MAX_SIZE) {
        toast.add({
          title: 'حدث خطأ أثناء رفع الملف',
          description: ' حجم الملف أكبر من الحجم المسموح ( mb 50 ) ',
        });
      } else {
        toast.add({
          title: 'حدث خطأ أثناء رفع الملف',
        });
      }
    },
    [MAX_SIZE],
  );

  const processFile = React.useCallback(
    async (file: File) => {
      if (!worker) {
        toast.add({
          title: 'جاري تهيئة معالج الملفات، يرجى المحاولة بعد لحظات',
        });
        return;
      }

      setIsLoadingSheets(true);
      try {
        const buffer = await file.arrayBuffer();

        // ----------------------------------------------------------------------------------------
        // ZERO-COPY BUFFER TRANSFER (Comlink.transfer):
        // OBJECTIVE: Instead of cloning the 30MB+ ArrayBuffer into worker memory (which would allocate
        // an extra 30MB+ RAM and briefly freeze the UI thread during serialization), we transfer
        // direct ownership of the buffer to the Web Worker thread instantaneously (0ms copy time).
        // The Web Worker will parse and cache the workbook in its own background memory for all steps.
        // ----------------------------------------------------------------------------------------
        const names = await worker.loadWorkbook(Comlink.transfer(buffer, [buffer]));

        setSheetNames(names);
        if (names.length === 1) {
          handleUploadStep(file, 0);
        } else if (names.length > 1) {
          setSelectedSheetIndex(0);
          setFiles([file]);
        } else {
          toast.add({
            title: 'الملف لا يحتوي على أوراق عمل (excel sheets)  ',
          });
        }
      } catch (error) {
        console.error(error);
        toast.add({
          title: 'فشل في قراءة ملف Excel',
          description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء قراءة ملف Excel',
        });
      } finally {
        setIsLoadingSheets(false);
      }
    },
    [handleUploadStep, worker],
  );

  const handleValueChange = React.useCallback(
    async (newFiles: File[]) => {
      const file = newFiles[0] ?? null;

      if (file) {
        processFile(file);
      } else {
        await resetWorker();
        setFiles([]);
        setSheetNames([]);
        setSelectedSheetIndex(null);
      }
    },
    [processFile, resetWorker],
  );

  const handleConfirm = () => {
    if (files[0] && selectedSheetIndex !== null) {
      handleUploadStep(files[0], selectedSheetIndex);
    }
  };

  const handleReset = async () => {
    await resetWorker();
    setFiles([]);
    setSheetNames([]);
    setSelectedSheetIndex(null);
  };

  if (isLoadingSheets) {
    return (
      <div className='flex min-h-55 flex-col items-center justify-center gap-3 p-8' dir='rtl'>
        <Loader2 className='text-primary h-8 w-8 animate-spin' />
        <p className='text-muted-foreground text-sm font-medium'>جاري فحص ملف Excel...</p>
      </div>
    );
  }

  if (files[0] && sheetNames.length > 1) {
    return (
      <div className='bg-card w-full max-w-md rounded-xl border p-6 shadow-sm' dir='rtl'>
        <div className='mb-6 flex flex-col gap-2 text-right'>
          <h3 className='text-foreground text-lg font-semibold'>تحديد ورقة العمل</h3>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            يحتوي ملف Excel المرفوع ({files[0].name}) على أوراق عمل متعددة. يرجى اختيار الورقة التي تحتوي على بيانات
            الطلاب:
          </p>
        </div>

        <div className='flex max-h-60 flex-col gap-2 overflow-y-auto pr-1'>
          {sheetNames.map((name, index) => {
            const isSelected = selectedSheetIndex === index;
            return (
              <button
                key={name}
                type='button'
                onClick={() => setSelectedSheetIndex(index)}
                className={`flex items-center justify-between rounded-lg border p-3.5 text-right transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary font-medium shadow-sm'
                    : 'border-border hover:bg-muted/50 text-foreground'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className='max-w-70 truncate text-sm font-medium'>{name}</span>
                </div>
                {isSelected && <Check className='text-primary h-4 w-4 shrink-0' />}
              </button>
            );
          })}
        </div>

        <Separator className='my-5' />

        <div className='mt-4 flex items-center gap-3'>
          <Button onClick={handleConfirm} className='flex-1 font-semibold' disabled={selectedSheetIndex === null}>
            تأكيد واستمرار
          </Button>
          <Button variant='outline' onClick={handleReset} className='font-medium'>
            تغيير الملف
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FileUpload
      value={files}
      onValueChange={handleValueChange}
      onFileValidate={onFileValidate}
      onFileReject={onFileReject}
      accept='.xls,.xlsx'
      maxFiles={1}
      maxSize={MAX_SIZE}
      className='w-full max-w-md'
    >
      <FileUploadDropzone>
        <div className='flex flex-col items-center gap-1'>
          <div className='flex items-center justify-center rounded-full border p-2.5'>
            <Upload className='text-muted-foreground size-6' />
          </div>

          <p className='text-sm font-medium'>اسحب و افلت ملف الاكسل هنا</p>

          <p className='text-muted-foreground text-xs'>ملف .xls أو .xlsx ( 50mb بحد أقصى )</p>
        </div>

        <FileUploadTrigger>
          <Button variant='outline' size='sm' className='mt-2 w-fit'>
            اختر الملف
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>

      <FileUploadList>
        {files.map((file) => (
          <FileUploadItem className='text-right' dir='rtl' key={file.name} value={file}>
            <FileUploadItemMetadata />

            <FileUploadItemDelete>
              <Button variant='ghost' size='icon' className='size-7'>
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
