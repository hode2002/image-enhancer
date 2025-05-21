'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/api/media';
import { Progress } from '@/components/ui/progress';
import { createImage } from '@/lib/api/image';
import { ImageBasic } from '@/types/image.type';
import { useAuth } from '@clerk/nextjs';
import { ImagePreview } from '@/components/ImagePreview';

export const UploadForm = () => {
    const { userId } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedImage, setUploadedImage] = useState<ImageBasic | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            toast.error('Please login to upload');
            return;
        }

        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        try {
            const { url, format, size, width, height, publicId } = await uploadImage(
                file,
                progressEvent => {
                    const progress = Math.round(
                        (progressEvent.loaded * 50) / (progressEvent.total || 1),
                    );
                    setUploadProgress(progress);
                },
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
            const response = await createImage(image, progressEvent => {
                const progress = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total || 1),
                );
                setUploadProgress(progress);
            });

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
            <div className="space-y-2">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
                <p className="text-muted-foreground text-sm">Supported formats: JPG, PNG, WEBP</p>
            </div>

            {isUploading && (
                <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-muted-foreground text-right text-sm">{uploadProgress}%</p>
                </div>
            )}

            <Button type="submit" disabled={isUploading || !file} onClick={handleSubmit}>
                {isUploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    'Upload'
                )}
            </Button>

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
        </div>
    );
};
