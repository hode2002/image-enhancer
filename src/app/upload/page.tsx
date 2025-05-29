import { UploadForm } from '@/components/UploadForm';

export default async function UploadPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Upload Image</h1>
                    <p className="text-muted-foreground">Upload your image file here</p>
                </div>

                <UploadForm />
            </div>
        </div>
    );
}
