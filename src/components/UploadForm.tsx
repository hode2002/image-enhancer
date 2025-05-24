'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/api/media';
import { Progress } from '@/components/ui/progress';
import { createImage } from '@/lib/api/image';
import { ImageBasic } from '@/types/image.type';
import { useAuth } from '@clerk/nextjs';
import { ImagePreview } from '@/components/ImagePreview';
import { FileUpload, FileUploadRef } from '@/components/ui/file-upload';
import { AxiosProgressEvent } from 'axios';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const UploadForm = () => {
    const { userId } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedImage, setUploadedImage] = useState<ImageBasic | null>(null);
    const fileUploadRef = useRef<FileUploadRef>(null);

    const onProgress = (progressEvent: AxiosProgressEvent, loaded: number) => {
        const progress = Math.round((progressEvent.loaded * loaded) / (progressEvent.total || 1));
        setUploadProgress(prev => Math.min(prev + progress, 100));
    };

    const handleUpload = async (selectedFile: File) => {
        if (!userId) {
            toast.error('Please login to upload');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        try {
            const { url, format, size, width, height, publicId } = await uploadImage(
                selectedFile,
                progressEvent => onProgress(progressEvent, 50),
            );

            const image: ImageBasic = {
                userId,
                originalUrl: url,
                publicId,
                size,
                format,
                width,
                height,
            };
            const response = await createImage(image, progressEvent =>
                onProgress(progressEvent, 50),
            );

            setUploadedImage(image);
            console.log({ response });
            toast.success('File uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    const validateFile = (file: File): boolean => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error('Please upload a valid image file (JPEG, PNG, WEBP, or AVIF)');
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size must be less than 10MB');
            return false;
        }

        return true;
    };

    const handleFileChange = (files: File[]) => {
        if (files && files[0]) {
            const selectedFile = files[0];

            if (!validateFile(selectedFile)) {
                return;
            }

            setFile(selectedFile);

            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            setUploadProgress(0);
            setUploadedImage(null);

            handleUpload(selectedFile);
        }
    };

    const handleClear = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
        setUploadedImage(null);
        fileUploadRef.current?.clear();
    };

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Image URL copied to clipboard');
        } catch (error) {
            console.error('Failed to copy URL:', error);
            toast.error('Failed to copy URL');
        }
    };

    return (
        <div className="space-y-4">
            {isUploading && (
                <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-muted-foreground text-right text-sm">{uploadProgress}%</p>
                </div>
            )}
            <div className="relative">
                <Button
                    className="mx-auto min-h-96 w-full max-w-4xl rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black"
                    disabled={isUploading}
                >
                    <FileUpload
                        ref={fileUploadRef}
                        mode="single"
                        onChange={handleFileChange}
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    />
                </Button>

                {previewUrl && !isUploading && (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 shadow-lg transition-all hover:scale-105"
                        onClick={handleClear}
                        title="Clear"
                    >
                        <Trash className="h-4 w-4" />
                        <span className="text-sm font-medium">Clear</span>
                    </Button>
                )}
            </div>

            {previewUrl && (
                <div className="grid grid-cols-2 gap-6">
                    <ImagePreview
                        title="Original Image"
                        imageUrl={previewUrl}
                        metadata={
                            file ? { name: file.name, size: file.size, type: file.type } : undefined
                        }
                    />
                    <ImagePreview
                        title="Uploaded Image"
                        imageUrl={uploadedImage?.originalUrl ?? null}
                        metadata={
                            uploadedImage
                                ? {
                                      format: uploadedImage.format,
                                      size: uploadedImage.size,
                                      width: uploadedImage.width,
                                      height: uploadedImage.height,
                                  }
                                : undefined
                        }
                        onCopyUrl={uploadedImage ? handleCopyUrl : undefined}
                    />
                </div>
            )}
        </div>
    );
};
