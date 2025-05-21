import React from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import CustomSignInButton from '@/components/CustomSignInButton';
import CustomSignUpButton from '@/components/CustomSignUpButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import Navbar from '@/components/Navbar';
import { Logo } from '@/components/Logo';

const Header = () => {
    return (
        <header className="bg-background flex h-16 items-center justify-between gap-4 border-b p-4">
            <div className="flex items-center gap-4">
                <Logo />
            </div>
            <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
            </div>
            <div className="flex items-center gap-4">
                <SignedIn>
                    <Navbar />
                </SignedIn>
                <SignedOut>
                    <CustomSignInButton />
                    <CustomSignUpButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    );
};

export default Header;
