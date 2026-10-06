import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/toast';
import queryClient from '@/config/react-qeury';
import { useMutation } from '@tanstack/react-query';
import * as Comlink from 'comlink';
import { AlertCircle, CheckCircle2, Database, Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useExcelWorker } from '../../context/excel-worker-context';
import { useStudents } from '../../hooks/useStudents';
import type { CreateStudentInput } from '../../model/student';
import type { KeysToExcelColumnsInput } from '../../schemas/keysToExcelColumns';
import type { FirstAndLastRowInput } from '../../schemas/mapFirstAndLastRow';

interface ExtractStudentsProps {
  schoolYear: number;
  sheetNumber: number;
  firstAndLastRow: FirstAndLastRowInput;
  columns: KeysToExcelColumnsInput;
  violationsDuration: Record<string, number | null>;
  handleAddStudentsStep: () => void;
}

const ExtractStudents = ({
  schoolYear,
  sheetNumber,
  firstAndLastRow,
  columns,
  violationsDuration,
  handleAddStudentsStep,
}: ExtractStudentsProps) => {
  const { worker } = useExcelWorker();
  const { addStudents } = useStudents();
  const [phase, setPhase] = useState<'extracting' | 'saving' | 'completed'>('extracting');
  const [extractedCount, setExtractedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasStartedRef = useRef(false);

  const totalCount = Math.max(1, firstAndLastRow.lastRow - firstAndLastRow.firstRow + 1);

  const { mutateAsync } = useMutation({
    mutationFn: (students: CreateStudentInput[]) => addStudents(students),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const runExtraction = useCallback(async () => {
    if (!worker) return;

    setErrorMessage(null);
    setPhase('extracting');
    setExtractedCount(0);

    try {
      // Comlink proxy callback passed as top-level argument so Comlink can transfer the MessagePort
      const progressCallback = Comlink.proxy((processed: number) => {
        setExtractedCount(processed);
      });

      const extractedStudents = await worker.extractStudents(
        {
          sheetNumber,
          schoolYear,
          firstRow: firstAndLastRow.firstRow,
          lastRow: firstAndLastRow.lastRow,
          columns,
          violationsDuration,
        },
        progressCallback,
      );

      setExtractedCount(extractedStudents.length);
      setPhase('saving');

      await mutateAsync(extractedStudents);
      toast.add({
        title: 'تم استخراج وإضافة قائمة الطلاب بنجاح',
      });
      setPhase('completed');
    } catch (error) {
      console.error('Error during student extraction:', error);
      hasStartedRef.current = false; // Allow retry on failure
      const msg = typeof error === 'string' ? error : (error as Error)?.message || 'خطأ غير معروف';
      setErrorMessage(msg);
      toast.add({
        title: 'حدث خطأ أثناء استخراج وإضافة البيانات',
        description: msg,
      });
    }
  }, [worker, sheetNumber, schoolYear, firstAndLastRow, columns, violationsDuration, mutateAsync]);

  useEffect(() => {
    if (!worker || hasStartedRef.current) return;
    hasStartedRef.current = true;
    runExtraction();
  }, [worker, runExtraction]);

  const handleRetry = () => {
    hasStartedRef.current = true;
    runExtraction();
  };

  const progressPercent = Math.min(100, Math.round((extractedCount / totalCount) * 100));

  return (
    <div className='mx-auto w-full max-w-xl py-12' dir='rtl'>
      <Card className='border-2 shadow-md'>
        <CardContent className='flex flex-col items-center justify-center space-y-6 pt-8 pb-8 text-center'>
          {errorMessage ? (
            <>
              <div className='bg-destructive/10 rounded-full p-4'>
                <AlertCircle className='text-destructive size-16' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-destructive text-xl font-bold'>حدث خطأ أثناء استخراج البيانات</h3>
                <p className='text-muted-foreground mx-auto max-w-md text-sm'>{errorMessage}</p>
              </div>
              <Button onClick={handleRetry} variant='outline' size='lg' className='gap-2 px-8 font-bold'>
                <RefreshCw className='size-4' />
                <span>إعادة المحاولة</span>
              </Button>
            </>
          ) : phase !== 'completed' ? (
            <>
              <div className='relative flex items-center justify-center'>
                {phase === 'extracting' ? (
                  <Loader2 className='text-primary size-16 animate-spin' />
                ) : (
                  <div className='relative'>
                    <Database className='text-primary size-16 animate-pulse' />
                    <Loader2 className='text-primary absolute -bottom-1 -left-1 size-7 animate-spin' />
                  </div>
                )}
              </div>
              <div className='w-full space-y-2 px-4'>
                <h3 className='text-foreground text-xl font-bold'>
                  {phase === 'extracting'
                    ? 'جاري استخراج بيانات الطلاب من الملف...'
                    : 'جاري حفظ البيانات في قاعدة البيانات...'}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  {phase === 'extracting'
                    ? 'نقوم الآن بقراءة الصفوف وتحليل البيانات في الخلفية عبر معالج منفصل دون تجميد واجهة التطبيق.'
                    : 'تم استخراج كافة السجلات بنجاح، جاري الآن حفظها على القرص.'}
                </p>
              </div>

              <div className='w-full max-w-md space-y-2.5 px-4'>
                <div className='text-muted-foreground flex items-center justify-between text-xs font-semibold'>
                  <span>
                    {phase === 'saving'
                      ? `اكتمل الاستخراج (${extractedCount} طالب)، جاري الحفظ...`
                      : `تم استخراج ${extractedCount} من ${totalCount} طالب`}
                  </span>
                  <span className='text-primary font-mono text-sm font-bold'>
                    {phase === 'saving' ? '100%' : `${progressPercent}%`}
                  </span>
                </div>
                <Progress value={phase === 'saving' ? 100 : progressPercent} className='w-full' />
              </div>
            </>
          ) : (
            <>
              <div className='bg-primary/10 rounded-full p-4'>
                <CheckCircle2 className='text-primary size-16' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-foreground text-xl font-bold'>تم إضافة الطلاب بنجاح!</h3>
                <p className='text-muted-foreground text-sm'>
                  تم استخراج وتمثيل <span className='text-foreground font-semibold'>{extractedCount}</span> طالب
                  وإضافتهم بنجاح إلى قاعدة البيانات.
                </p>
              </div>
              <Button onClick={handleAddStudentsStep} size='lg' className='mt-4 px-10 font-bold'>
                موافق
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtractStudents;
