import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
                <div className="absolute rounded-lg" />
                <Image
                    src={'/logo.png'}
                    alt="logo"
                    fill
                    className="absolute inset-0 h-full w-full rounded-lg text-white"
                />
            </div>
            <div className="hidden flex-col lg:flex">
                <span className="text-xl font-bold tracking-tight">Image Enhancer</span>
                <span className="text-muted-foreground text-xs">Transform & Optimize</span>
            </div>
        </Link>
    );
}
