"use client";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import type { DragEvent } from "react";

export const FileUploadComponent = () => {
    const [isDragging, setIsDragging] = useState(false);

    const uploadPdf = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append("pdf", file);
        const response = await fetch("http://localhost:8000/upload/pdf", {
            method: "POST",
            body: formData,
        });
        return response.json();
    }, []);

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files.item(0);
        if (!file || file.type !== "application/pdf") return;
        await uploadPdf(file);
    }, []);

    const handleFileUpload = useCallback(() => {
        const el = document.createElement("input");
        el.setAttribute("type", "file");
        el.setAttribute("accept", "application/pdf");
        el.addEventListener("change", (e) => {
            handleFiles(el.files);
        });
        el.click();
    }, [handleFiles]);

    const handleDragOver = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDragging) setIsDragging(true);
        },
        [isDragging]
    );

    const handleDragEnter = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDragging) setIsDragging(true);
        },
        [isDragging]
    );

    const handleDragLeave = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (isDragging) setIsDragging(false);
        },
        [isDragging]
    );

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const files = e.dataTransfer?.files ?? null;
            handleFiles(files);
        },
        [handleFiles]
    );

    return (
        <div
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`bg-slate-900 text-white shadow-2xl flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                isDragging ? "border-blue-400 bg-slate-800" : "border-white"
            }`}
        >
            <div
                onClick={handleFileUpload}
                className="flex flex-col items-center justify-center cursor-pointer select-none"
            >
                <h3 className="text-2xl font-bold">
                    {isDragging ? "Drop the PDF here" : "Upload PDF file"}
                </h3>
                <Upload className="w-10 h-10" />
            </div>
        </div>
    );
};
