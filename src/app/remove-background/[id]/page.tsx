'use client';

import React, { use, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Loader2, Trash, Fullscreen } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AIRemoveBackground, createImage, getImageById } from '@/lib/api/image';
import { Compare } from '@/components/ui/compare';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import Lightbox from 'react-image-lightbox';
import { AxiosProgressEvent } from 'axios';
import { uploadImageByUrl } from '@/lib/api/media';
import { ImageBasic } from '@/types/image.type';
import { useAuth } from '@clerk/nextjs';

interface Props {
    params: Promise<{ id: string }>;
}

interface ImageData {
    id: string;
    originalUrl: string;
    processedUrl?: string;
    width: number;
    height: number;
}

interface ProcessedImage {
    id: string;
    url: string;
    originalUrl: string;
    createdAt: string;
}

const RemoveBackgroundDetail = ({ params }: Props) => {
    const { userId } = useAuth();

    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState<ImageData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [processedUrl, setProcessedUrl] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const downloadBtnRef = React.useRef<HTMLAnchorElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const data = await getImageById(id);
                setImage(data);
                setPreviewUrl(data.originalUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
                toast.error('Failed to load image');
            } finally {
                setIsLoading(false);
            }
        };

        fetchImage();
    }, [id]);

    const onProgress = (progressEvent: AxiosProgressEvent, loaded: number) => {
        const progress = Math.round((progressEvent.loaded * loaded) / (progressEvent.total || 1));
        setProgress(prev => Math.min(prev + progress, 100));
    };

    const handleProcess = async () => {
        if (!userId) {
            toast.error('Please login to upload');
            return;
        }

        if (!image) return;

        setIsProcessing(true);
        setProgress(0);

        try {
            const {
                data: { processedImageUrl },
            } = await AIRemoveBackground(image.originalUrl, progressEvent =>
                onProgress(progressEvent, 20),
            );

            const { url, format, size, width, height, publicId } = await uploadImageByUrl(
                processedImageUrl,
                progressEvent => onProgress(progressEvent, 50),
            );

            const newImage: ImageBasic = {
                userId,
                originalUrl: url,
                publicId,
                size,
                format,
                width,
                height,
            };
            const response = await createImage(newImage, progressEvent =>
                onProgress(progressEvent, 100),
            );

            console.log(response);

            const processedImage: ProcessedImage = {
                id: Date.now().toString(),
                url: processedImageUrl,
                originalUrl: image.originalUrl,
                createdAt: new Date().toISOString(),
            };
            setProcessedUrl(processedImage.url);
            toast.success('Background removed successfully');
        } catch (error) {
            console.error('Error processing image:', error);
            toast.error('Failed to remove background');
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const handleDownload = async () => {
        if (!processedUrl || !downloadBtnRef.current) return;

        setIsDownloading(true);
        try {
            const response = await fetch(processedUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            downloadBtnRef.current.href = url;
            downloadBtnRef.current.download = `removed-background-${id}.png`;
            downloadBtnRef.current.click();

            window.URL.revokeObjectURL(url);
            toast.success('Image downloaded successfully');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download image');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleClear = () => {
        downloadBtnRef.current = null;
        setProcessedUrl('');
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!image) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Failed to load image</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => router.push('/remove-background')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Gallery
                </Button>
                <div className="flex items-center gap-4">
                    {!processedUrl ? (
                        <Button
                            variant="default"
                            className="cursor-pointer"
                            onClick={handleProcess}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Remove Background'
                            )}
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={handleDownload}
                                className="cursor-pointer"
                                disabled={isDownloading}
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </>
                                )}
                            </Button>
                            <Button onClick={handleClear} className="cursor-pointer">
                                <Trash className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {isProcessing && (
                <div className="mb-8 space-y-2">
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                        <span>Processing image...</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            )}

            <div className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="overflow-hidden">
                        <div className="p-4">
                            <h2 className="mb-4 text-lg font-semibold">Original Image</h2>
                            <div className="relative aspect-square w-full">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        className="rounded-2xl object-contain"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="text-muted-foreground flex h-full items-center justify-center">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="p-4">
                            <div className="flex justify-between">
                                <h2 className="mb-4 text-lg font-semibold">Processed Image</h2>
                                {processedUrl && (
                                    <Button
                                        title="Fullscreen"
                                        onClick={() => setIsOpen(true)}
                                        variant={'outline'}
                                        className="cursor-pointer hover:opacity-80"
                                    >
                                        <Fullscreen />
                                    </Button>
                                )}
                            </div>
                            <div className="relative aspect-square w-full">
                                {processedUrl ? (
                                    <Compare
                                        firstImage={previewUrl}
                                        secondImage={processedUrl}
                                        firstImageClassName="object-contain"
                                        secondImageClassname="object-contain"
                                        slideMode="hover"
                                        className="h-full w-full"
                                    />
                                ) : (
                                    <div className="text-muted-foreground flex h-full items-center justify-center">
                                        {isProcessing ? (
                                            <div className="text-center">
                                                <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
                                                <p>Processing your image...</p>
                                            </div>
                                        ) : (
                                            'Process an image to see the result'
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <a hidden ref={downloadBtnRef} />
            {isOpen && (
                <Lightbox
                    mainSrc={processedUrl}
                    onCloseRequest={() => setIsOpen(false)}
                    imageTitle="Processed Image"
                    imageCaption="Background removed image"
                />
            )}
        </div>
    );
};

export default RemoveBackgroundDetail;
