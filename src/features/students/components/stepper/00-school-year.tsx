import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface SchoolYearProps {
    handlePickSchoolYearStep: (schoolYear: number) => void;
}

const PickSchoolYear = ({ handlePickSchoolYearStep }: SchoolYearProps) => {
    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

    const years = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedYear) {
            handlePickSchoolYearStep(Number(selectedYear));
        }
    };

    return (
        <Card className="max-w-md mx-auto my-8 p-6 shadow-md border rounded-xl" dir="rtl">
            <CardContent className="pt-6 space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        اختر السنة الدراسية
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        يرجى تحديد دورة السنة الدراسية للمتابعة
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FieldGroup>
                        <Field className='flex flex-row'>
                            <FieldLabel className="flex-1 text-right font-medium text-foreground">
                                دورة جوان
                            </FieldLabel>
                            <Select value={selectedYear} onValueChange={(e) => setSelectedYear(e ?? '2024')}>
                                <SelectTrigger className="w-full text-right flex-2" dir="rtl">
                                    <SelectValue placeholder="اختر السنة" />
                                </SelectTrigger>
                                <SelectContent dir="rtl">
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year}>
                                           {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                    <Button type="submit" className="w-full text-base font-semibold">
                        تأكيد والمتابعة
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default PickSchoolYear;