import ImageGrid from '@/components/ImageGrid';
import { getUserImage } from '@/lib/api/image';

export default async function RemoveBackgroundPage() {
    const images = await getUserImage();

    return (
        <div className="container mx-auto max-w-7xl py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Remove Background</h1>
                    <p className="text-muted-foreground">Select an image to remove</p>
                </div>

                <ImageGrid
                    label="Remove Background"
                    images={images}
                    urlToRedirect="/remove-background"
                />
            </div>
        </div>
    );
}
