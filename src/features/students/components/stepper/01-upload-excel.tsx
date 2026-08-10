import { Button } from "@/components/ui/button";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadList,
    FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Check, Loader2, Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Separator } from '@/components/ui/separator';
import * as XLSX from 'xlsx';


interface UploadExcelProps {
    handleUploadStep: (file: File, sheetNumber: number) => void;
}

export function UploadExcel({ handleUploadStep }: UploadExcelProps) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [sheetNames, setSheetNames] = React.useState<string[]>([]);
    const [selectedSheetIndex, setSelectedSheetIndex] = React.useState<number | null>(null);
    const [isLoadingSheets, setIsLoadingSheets] = React.useState<boolean>(false);

    const onFileValidate = React.useCallback((file: File): string | null => {
        const allowedMimeTypes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        const isExcelFile =
            allowedMimeTypes.includes(file.type) ||
            file.name.endsWith(".xls") ||
            file.name.endsWith(".xlsx");

        if (!isExcelFile) {
            return "Only Excel files (.xls, .xlsx) are allowed";
        }

        const MAX_SIZE = 10 * 1024 * 1024; // 10MB

        if (file.size > MAX_SIZE) {
            return "File size must be less than 10MB";
        }

        return null;
    }, []);

    const onFileReject = React.useCallback(
        (file: File, message: string) => {
            toast(message, {
                description: `"${file.name}" has been rejected`,
            });
        },
        [],
    );

    const processFile = React.useCallback((file: File) => {
        setIsLoadingSheets(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const names = workbook.SheetNames;
                setSheetNames(names);
                if (names.length === 1) {
                    handleUploadStep(file, 0);
                } else if (names.length > 1) {
                    setSelectedSheetIndex(0);
                    setFiles([file]);
                } else {
                    toast.error("الملف لا يحتوي على أوراق عمل (excel sheets)  ");
                }
            } catch (error) {
                console.error(error);
                toast.error("فشل في قراءة ملف Excel");
            } finally {
                setIsLoadingSheets(false);
            }
        };
        reader.onerror = () => {
            toast.error("فشل في قراءة الملف");
            setIsLoadingSheets(false);
        };
        reader.readAsArrayBuffer(file);
    }, [handleUploadStep]);

    const handleValueChange = React.useCallback(
        (newFiles: File[]) => {
            const file = newFiles[0] ?? null;

            if (file) {
                processFile(file);
            } else {
                setFiles([]);
                setSheetNames([]);
                setSelectedSheetIndex(null);
            }
        },
        [processFile],
    );

    const handleConfirm = () => {
        if (files[0] && selectedSheetIndex !== null) {
            handleUploadStep(files[0], selectedSheetIndex);
        }
    };

    const handleReset = () => {
        setFiles([]);
        setSheetNames([]);
        setSelectedSheetIndex(null);
    };

    if (isLoadingSheets) {
        return (
            <div className="flex flex-col items-center justify-center p-8 gap-3 min-h-55" dir="rtl">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-medium">
                    جاري فحص ملف Excel...
                </p>
            </div>
        );
    }

    if (files[0] && sheetNames.length > 1) {
        return (
            <div className="w-full max-w-md p-6 bg-card rounded-xl border shadow-sm" dir="rtl">
                <div className="flex flex-col gap-2 text-right mb-6">
                    <h3 className="font-semibold text-lg text-foreground">
                        تحديد ورقة العمل
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        يحتوي ملف Excel المرفوع ({files[0].name}) على أوراق عمل متعددة. يرجى اختيار الورقة التي تحتوي على بيانات الطلاب:
                    </p>
                </div>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                    {sheetNames.map((name, index) => {
                        const isSelected = selectedSheetIndex === index;
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => setSelectedSheetIndex(index)}
                                className={`flex items-center justify-between p-3.5 rounded-lg border text-right transition-all duration-200 ${isSelected
                                        ? "border-primary bg-primary/5 text-primary font-medium shadow-sm"
                                        : "border-border hover:bg-muted/50 text-foreground"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium truncate max-w-70">
                                        {name}
                                    </span>
                                </div>
                                {isSelected && (
                                    <Check className="h-4 w-4 text-primary shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <Separator className="my-5" />

                <div className="flex items-center gap-3 mt-4">
                    <Button
                        onClick={handleConfirm}
                        className="flex-1 font-semibold"
                        disabled={selectedSheetIndex === null}
                    >
                        تأكيد واستمرار
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="font-medium"
                    >
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
            accept=".xls,.xlsx"
            maxFiles={1}
            className="w-full max-w-md"
        >
            <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="size-6 text-muted-foreground" />
                    </div>

                    <p className="font-medium text-sm">
                        اسحب و افلت ملف الاكسل هنا
                    </p>

                    <p className="text-muted-foreground text-xs">
                        .xls or .xlsx (max 10MB)
                    </p>
                </div>

                <FileUploadTrigger >
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                        اختر الملف
                    </Button>
                </FileUploadTrigger>
            </FileUploadDropzone>

            <FileUploadList>
                {files.map((file) => (
                    <FileUploadItem className="text-right" dir="rtl" key={file.name} value={file}>
                        <FileUploadItemMetadata />

                        <FileUploadItemDelete >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                            >
                                <X />
                            </Button>
                        </FileUploadItemDelete>
                    </FileUploadItem>
                ))}
            </FileUploadList>
        </FileUpload>
    );
}