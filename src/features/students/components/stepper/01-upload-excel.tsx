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
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface UploadExcelProps {
    handleUploadStep: (file: File | null) => void;
}

export function UploadExcel({ handleUploadStep }: UploadExcelProps) {
    const [files, setFiles] = React.useState<File[]>([]);

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

    const handleValueChange = React.useCallback(
        (newFiles: File[]) => {
            const file = newFiles[0] ?? null;

            setFiles(file ? [file] : []);
            handleUploadStep(file);
        },
        [handleUploadStep],
    );

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
                        Drag & drop an Excel file
                    </p>

                    <p className="text-muted-foreground text-xs">
                        .xls or .xlsx (max 10MB)
                    </p>
                </div>

                <FileUploadTrigger >
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                        Browse file
                    </Button>
                </FileUploadTrigger>
            </FileUploadDropzone>

            <FileUploadList>
                {files.map((file) => (
                    <FileUploadItem key={file.name} value={file}>
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