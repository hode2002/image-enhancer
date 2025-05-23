'use client';

import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useImage } from '@/hooks/useImage';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { TransformImage, TransformOptions } from '@/types/image.type';
import { getTransformedImage, transformImage } from '@/lib/api/image';
import { use } from 'react';
import { convertQueryToTransformOption } from '@/lib/utils';
import { Compare } from '@/components/ui/compare';
import { TransformHistory } from '@/components/TransformHistory';
import { TransformOptionsComponent } from '@/components/TransformOptions';

const defaultTransformOptions: TransformOptions = {
    w: undefined,
    h: undefined,
    format: 'jpeg',
    fit: 'cover',
    quality: 80,
    grayscale: false,
    blur: 0,
    sharpen: false,
    rotate: 0,
    enhance: '2x',
};

interface props {
    params: Promise<{ id: string }>;
}

export default function TransformPage({ params }: props) {
    const { id } = use(params);

    const { image, isLoading } = useImage(id);
    const [transformOptions, setTransformOptions] =
        useState<TransformOptions>(defaultTransformOptions);
    const [isTransforming, setIsTransforming] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [transformedUrl, setTransformedUrl] = useState<string>('');
    const [transformHistory, setTransformHistory] = useState<TransformImage[]>([]);
    const downloadBtnRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const fetchTransformed = async () => {
            const transformedImage = await getTransformedImage(id);
            setTransformHistory(transformedImage);
        };
        fetchTransformed();
    }, [id]);

    useEffect(() => {
        if (image) {
            setPreviewUrl(image.originalUrl);
        }
    }, [image]);

    const handleTransform = async () => {
        if (!image) return;

        setIsTransforming(true);
        try {
            const transformedImage = await transformImage(id, transformOptions);
            setTransformedUrl(transformedImage.url);
            setTransformHistory(prev => [transformedImage, ...prev]);
            toast.success('Image transformed successfully');
        } catch (error) {
            console.log(error);
            toast.error('Failed to transform image');
        } finally {
            setIsTransforming(false);
        }
    };

    const handleHistoryItemClick = (item: TransformImage) => {
        setTransformedUrl(item.url);
        const querystring = JSON.parse(item.options);
        const queryOption = convertQueryToTransformOption(querystring);
        setTransformOptions(queryOption);
    };

    const handleRemoveHistoryItem = (itemId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTransformHistory(prev => prev.filter(item => item.id !== itemId));
    };

    const handleDownload = async () => {
        if (!transformedUrl || !downloadBtnRef.current) return;

        try {
            const response = await fetch(transformedUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            downloadBtnRef.current.href = url;
            downloadBtnRef.current.download = `transformed-image-${id}.${transformOptions.format}`;
            downloadBtnRef.current.click();

            window.URL.revokeObjectURL(url);
            toast.success('Image downloaded successfully');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download image');
        }
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
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                    <Card className="relative aspect-square overflow-hidden">
                        {!transformedUrl ? (
                            previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    unoptimized
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="text-muted-foreground flex h-full items-center justify-center">
                                    No preview available
                                </div>
                            )
                        ) : (
                            <div className="relative h-full w-full">
                                <Compare
                                    firstImage={previewUrl}
                                    secondImage={transformedUrl}
                                    firstImageClassName="object-contain"
                                    secondImageClassname="object-contain"
                                    slideMode="hover"
                                    className="h-full w-full"
                                />
                            </div>
                        )}
                    </Card>

                    <TransformHistory
                        history={transformHistory}
                        onHistoryItemClick={handleHistoryItemClick}
                        onRemoveHistoryItem={handleRemoveHistoryItem}
                    />
                </div>
                <TransformOptionsComponent
                    options={transformOptions}
                    onOptionsChange={setTransformOptions}
                    onTransform={handleTransform}
                    onDownload={handleDownload}
                    isTransforming={isTransforming}
                    hasTransformedImage={!!transformedUrl}
                    originalWidth={image.width}
                    originalHeight={image.height}
                />

                <a hidden ref={downloadBtnRef} />
            </div>
        </div>
    );
}
