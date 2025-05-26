import ImageGrid from '@/components/ImageGrid';

export default async function RemoveBackgroundPage() {
    return (
        <div className="container mx-auto max-w-7xl py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Remove Background</h1>
                    <p className="text-muted-foreground">Select an image to remove</p>
                </div>

                <ImageGrid label="Remove Background" urlToRedirect="/remove-background" />
            </div>
        </div>
    );
}
