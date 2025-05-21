import { getImageById } from '@/lib/api/image';
import { ImageFull } from '@/types/image.type';
import { useEffect, useState } from 'react';

interface UseImageResult {
    image: ImageFull | null;
    isLoading: boolean;
    error: Error | null;
}

export function useImage(id: string): UseImageResult {
    const [image, setImage] = useState<ImageFull | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const image = await getImageById(id);
                setImage(image);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch image'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchImage();
    }, [id]);

    return { image, isLoading, error };
}
