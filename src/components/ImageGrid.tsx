'use client';

import { Button } from '@/components/ui/button';
import { deleteImage, getUserImage } from '@/lib/api/image';
import { ImageFull } from '@/types/image.type';
import { ImageIcon, Loader2, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface props {
    label: string;
    urlToRedirect: string;
}

const ImageGrid = ({ label, urlToRedirect }: props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState<ImageFull[]>([]);
    const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const userImages = await getUserImage();
                setImages(userImages);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching images:', error);
                toast.error('Failed to load images');
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleRedirect = (imageId: string) => {
        router.push(`${urlToRedirect}/${imageId}`);
    };

    const handleDeleteClick = (imageId: string) => {
        setImageToDeleteId(imageId);
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        if (!imageToDeleteId) return;

        setIsDeleting(true);
        try {
            const { id } = await deleteImage(imageToDeleteId);
            setImages(prev => prev.filter(image => image.id !== id));
            if (id) {
                toast.success('Image deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Failed to delete image');
        } finally {
            setIsDeleting(false);
            setImageToDeleteId(null);
            setShowConfirmDelete(false);
        }
    };

    const cancelDelete = () => {
        setImageToDeleteId(null);
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
                        <div
                            key={image.id}
                            data-id={image.id}
                            className="group relative aspect-square"
                        >
                            <Image
                                src={image.originalUrl}
                                alt={`Image ${image.id}`}
                                fill
                                className="rounded-lg object-cover"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                    className="cursor-pointer"
                                    variant="secondary"
                                    size="default"
                                    onClick={() => handleRedirect(image.id)}
                                >
                                    {label}
                                </Button>
                                <Button
                                    className="hidden cursor-pointer md:flex"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteClick(image.id)}
                                >
                                    <Trash />
                                </Button>
                            </div>
                            <Button
                                className="absolute top-0 right-0 flex cursor-pointer flex-col items-center justify-center gap-2 md:hidden"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteClick(image.id)}
                            >
                                <Trash />
                            </Button>
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

            <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your image.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={cancelDelete}
                            disabled={isDeleting}
                            className="cursor-pointer"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
                        >
                            {isDeleting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ImageGrid;
