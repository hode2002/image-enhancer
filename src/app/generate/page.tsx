import { GenerateForm } from '@/components/GenerateForm';

export default function GeneratePage() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Generate Image</h1>
                <p className="text-muted-foreground mt-2">
                    Enter a prompt to generate an image using AI
                </p>
            </div>

            <GenerateForm />
        </div>
    );
}
