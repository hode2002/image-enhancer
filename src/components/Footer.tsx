import Link from 'next/link';
import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-background mt-auto border-t">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                        © 2025 Image Enhancer. All rights reserved.
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com/hode2002"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
