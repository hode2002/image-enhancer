'use client';

import { SignInButton } from '@clerk/nextjs';
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomSignInButtonProps {
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

const CustomSignInButton: FC<CustomSignInButtonProps> = ({
    className = '',
    variant = 'default',
    size = 'default',
}) => {
    const isMobile = useIsMobile();
    return (
        <SignInButton
            mode="modal"
            forceRedirectUrl={process.env.NEXT_PUBLIC_APP_URL + '/auth-success'}
        >
            <Button variant={variant} size={size} className={className}>
                <LogIn className="h-4 w-4" />
                {!isMobile && <span className="ml-2">Sign In</span>}
            </Button>
        </SignInButton>
    );
};

export default CustomSignInButton;
