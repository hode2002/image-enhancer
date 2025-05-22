import { getUserImage } from '@/lib/api/image';
import ImageGrid from '@/app/transform/ImageGrid';

export default async function TransformPage() {
    const images = await getUserImage();

    return (
        <div className="container mx-auto max-w-7xl py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Transform Images</h1>
                    <p className="text-muted-foreground">Select an image to transform</p>
                </div>

                <ImageGrid images={images} />
            </div>
        </div>
    );
}
