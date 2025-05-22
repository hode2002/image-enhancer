'use client';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { SignUpButton } from '@clerk/nextjs';
import { UserRoundPlus } from 'lucide-react';

interface CustomSignUpButtonProps {
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

const CustomSignUpButton = ({
    className = '',
    variant = 'default',
    size = 'default',
}: CustomSignUpButtonProps) => {
    const isMobile = useIsMobile();
    return (
        <SignUpButton mode="modal">
            <Button variant={variant} size={size} className={className}>
                <UserRoundPlus className="h-4 w-4" />
                {!isMobile && 'Sign Up'}
            </Button>
        </SignUpButton>
    );
};

export default CustomSignUpButton;
