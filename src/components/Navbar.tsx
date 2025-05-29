import React, { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, ImageUpscale, Upload } from 'lucide-react';
import { RemoveBackgroundIcon } from '@/components/RemoveBackgroundIcon';
import Link from 'next/link';

type NavItem = {
    label: string;
    url: string;
    icon: JSX.ElementType;
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
    return (
        <nav className="container mx-auto flex h-16 items-center gap-4 px-2">
            <div className="ml-auto flex items-center space-x-4">
                {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.url} href={item.url}>
                            <Button
                                className="flex cursor-pointer items-center gap-2"
                                title={item.label}
                                key={item.url}
                                variant="default"
                                size="sm"
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden lg:block">{item.label}</span>
                            </Button>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
