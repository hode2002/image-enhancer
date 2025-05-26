import { GenerateForm } from '@/components/GenerateForm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import RotatingText from '@/components/blocks/TextAnimations/RotatingText/RotatingText';

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col py-8">
            <section className="flex flex-col items-center justify-center space-y-4 px-4 py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tighter md:text-4xl lg:text-7xl">
                    <span className="flex flex-col gap-2 md:flex-row">
                        <RotatingText
                            texts={['Generate', 'Transform']}
                            mainClassName="w-full md:w-fit px-2 sm:px-2 md:px-3 bg-gradient-to-l from-blue-500 to-purple-600 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                            staggerFrom={'last'}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '-120%' }}
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                            rotationInterval={2000}
                        />
                        <span>Your Images with</span>{' '}
                    </span>

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
