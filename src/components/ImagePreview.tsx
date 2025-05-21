'use client';

import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Code } from 'lucide-react';
import Image from 'next/image';

interface ImagePreviewProps {
    title: string;
    imageUrl: string | null;
    metadata?: {
        name?: string;
        size?: number;
        type?: string;
        format?: string;
        width?: number;
        height?: number;
    };
    onCopyUrl?: (url: string) => void;
}

export const ImagePreview = ({ title, imageUrl, metadata, onCopyUrl }: ImagePreviewProps) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="bg-muted group relative aspect-square w-full rounded-lg border">
                {imageUrl ? (
                    <>
                        <Image
                            src={imageUrl}
                            alt={`${title} preview`}
                            fill
                            className="rounded-lg object-contain"
                        />
                        {onCopyUrl && (
                            <Button
                                variant="secondary"
                                size="icon"
                                className="bg-background/80 hover:bg-background/90 absolute top-2 right-2 cursor-pointer opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
                                onClick={() => onCopyUrl(imageUrl)}
                                title="Copy URL"
                            >
                                <Code className="h-4 w-4" />
                            </Button>
                        )}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ImageIcon className="text-muted-foreground h-12 w-12" />
                    </div>
                )}
            </div>
            {metadata && (
                <div className="space-y-2 text-sm">
                    {metadata.name && (
                        <p>
                            <span className="font-medium">Name:</span> {metadata.name}
                        </p>
                    )}
                    {metadata.size && (
                        <p>
                            <span className="font-medium">Size:</span> {metadata.size} bytes
                        </p>
                    )}
                    {metadata.type && (
                        <p>
                            <span className="font-medium">Type:</span> {metadata.type}
                        </p>
                    )}
                    {metadata.format && (
                        <p>
                            <span className="font-medium">Format:</span> {metadata.format}
                        </p>
                    )}
                    {metadata.width && metadata.height && (
                        <p>
                            <span className="font-medium">Dimensions:</span> {metadata.width}x
                            {metadata.height}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
