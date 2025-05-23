'use client';

import React, { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ImagePlus, ImageUpscale, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RemoveBackgroundIcon } from '@/components/RemoveBackgroundIcon';

type NavItem = {
    label: string;
    url: string;
    icon: JSX.ElementType;
    width?: number;
    height?: number;
};

const navItems: NavItem[] = [
    { label: 'Upload', url: '/upload', icon: Upload },
    { label: 'Transform', url: '/transform', icon: ImageUpscale },
    {
        label: 'Remove Background',
        url: '/remove-background',
        icon: RemoveBackgroundIcon,
    },
    {
        label: 'Generate',
        url: '/generate',
        icon: ImagePlus,
    },
] as const;

const Navbar = () => {
    const router = useRouter();
    const isMobile = useIsMobile();

    return (
        <nav>
            <div className="container mx-auto flex h-16 items-center gap-4 px-4">
                <div className="ml-auto flex items-center space-x-4">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <Button
                                title={item.label}
                                key={item.url}
                                variant="default"
                                size="sm"
                                onClick={() => router.push(item.url)}
                                className="flex cursor-pointer items-center gap-2"
                            >
                                <Icon className="h-4 w-4" />
                                {!isMobile && item.label}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
