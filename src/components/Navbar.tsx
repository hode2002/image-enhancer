'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ImageUpscale, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
    const router = useRouter();
    const isMobile = useIsMobile();

    return (
        <nav>
            <div className="container mx-auto flex h-16 items-center gap-4 px-4">
                <div className="ml-auto flex items-center space-x-4">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push('/upload')}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        {!isMobile && 'Upload'}
                    </Button>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push('/transform')}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <ImageUpscale className="h-4 w-4" />
                        {!isMobile && 'Transform'}
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
