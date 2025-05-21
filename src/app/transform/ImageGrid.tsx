'use client';

import { Button } from '@/components/ui/button';
import { ImageFull } from '@/types/image.type';
import { ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ImageGrid = ({ images }: { images: ImageFull[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setIsLoading(true);
            } catch (error) {
                console.error('Error fetching images:', error);
                toast.error('Failed to load images');
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleTransform = (imageId: string) => {
        router.push(`/transform/${imageId}`);
    };

    return (
        <>
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="text-muted-foreground mb-4 h-12 w-12 animate-spin" />
                    <h3 className="text-lg font-semibold">Loading images...</h3>
                    <p className="text-muted-foreground text-sm">
                        Please wait while we fetch your images
                    </p>
                </div>
            )}

            {!isLoading && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {images.map(image => (
                        <div key={image.id} className="group relative aspect-square">
                            <Image
                                src={image.originalUrl}
                                alt={`Image ${image.id}`}
                                fill
                                className="rounded-lg object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                    className="cursor-pointer"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleTransform(image.id)}
                                >
                                    Transform
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ImageIcon className="text-muted-foreground mb-4 h-12 w-12" />
                    <h3 className="text-lg font-semibold">No images yet</h3>
                    <p className="text-muted-foreground text-sm">
                        Upload your first image to get started
                    </p>
                </div>
            )}
        </>
    );
};

export default ImageGrid;
