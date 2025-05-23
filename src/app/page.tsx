import { GenerateForm } from '@/components/GenerateForm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col py-8">
            <section className="flex flex-col items-center justify-center space-y-4 px-4 py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Transform Your Images with{' '}
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        AI-Powered Magic
                    </span>
                </h1>
                <p className="text-muted-foreground mx-auto max-w-[700px] sm:text-xl">
                    Upload your images and let our powerful AI enhance them. Transform, optimize,
                    and perfect your visuals in seconds.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/upload">
                            Get Started <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/transform">View Examples</Link>
                    </Button>
                </div>
            </section>

            <div className="bg-card container mx-auto rounded-lg border p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-semibold">Generate Image With AI</h2>
                <GenerateForm />
            </div>
        </div>
    );
}
