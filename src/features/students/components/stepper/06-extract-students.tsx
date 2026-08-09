import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { useStudents } from "../../hooks/useStudents";
import type { CreateStudentInput } from "../../model/student";
import type { KeysToExcelColumnsInput } from "../../schemas/keysToExcelColumns";
import type { FirstAndLastRowInput } from "../../schemas/mapFirstAndLastRow";
import queryClient from '@/config/react-qeury';

interface ExtractStudentsProps {
    schoolYear: number;
    excelArrayBuffer: ArrayBuffer;
    sheetNumber: number;
    firstAndLastRow: FirstAndLastRowInput;
    columns: KeysToExcelColumnsInput;
    violationsDuration: Record<string, number | null>;
    handleAddStudentsStep: () => void;
}

const ExtractStudents = ({
    schoolYear,
    excelArrayBuffer,
    sheetNumber,
    firstAndLastRow,
    columns,
    violationsDuration,
    handleAddStudentsStep
}: ExtractStudentsProps) => {
    const { addStudents } = useStudents();
    const [isCompleted, setIsCompleted] = useState(false);
    const [extractedCount, setExtractedCount] = useState(0);

    const { mutateAsync, } = useMutation({
        mutationFn: (students: CreateStudentInput[]) => addStudents(students),
        onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['students'] });
        }
    });

    useEffect(() => {
        const processAndSaveStudents = async () => {
            try {
                const workbook = XLSX.read(excelArrayBuffer, { type: 'array' });
                const sheetNames = workbook.SheetNames;
                const sheetName = sheetNames[sheetNumber] || sheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const extractedStudents: CreateStudentInput[] = [];

                for (let rowNum = firstAndLastRow.firstRow; rowNum <= firstAndLastRow.lastRow; rowNum++) {
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
                        schoolYear: schoolYear,
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
                }

                setExtractedCount(extractedStudents.length);
                console.log('ousil w length =', extractedStudents.length)
                await mutateAsync(extractedStudents);
                toast.success("تم استخراج وإضافة قائمة الطلاب بنجاح");
                setIsCompleted(true);
            } catch (error) {
                toast.error("حدث خطأ أثناء استخراج وإضافة البيانات", {
                    description: typeof error === 'string' ? error : (error as Error)?.message || "خطأ غير معروف"
                });
            }
        };

        processAndSaveStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full max-w-xl mx-auto py-12" dir="rtl">
            <Card className="border-2 shadow-md">
                <CardContent className="pt-8 pb-8 text-center flex flex-col items-center justify-center space-y-6">
                    {!isCompleted ? (
                        <>
                            <div className="relative flex items-center justify-center">
                                <Loader2 className="size-16 text-primary animate-spin" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground">جاري استخراج واستيراد البيانات...</h3>
                                <p className="text-sm text-muted-foreground">
                                    نقوم الآن باستخراج صفوف الطلاب من الملف وإضافتها إلى القاعدة. يرجى الانتظار لحين الانتهاء.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="rounded-full bg-primary/10 p-4">
                                <CheckCircle2 className="size-16 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground">تم إضافة الطلاب بنجاح!</h3>
                                <p className="text-sm text-muted-foreground">
                                    تم استخراج وتمثيل <span className="font-semibold text-foreground">{extractedCount}</span> طالب وإضافتهم بنجاح إلى قاعدة البيانات.
                                </p>
                            </div>
                            <Button onClick={handleAddStudentsStep} size="lg" className="px-10 font-bold mt-4">
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