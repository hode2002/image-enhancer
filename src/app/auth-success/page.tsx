'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { login } from '@/lib/api/auth';

export default function AuthSuccess() {
    const router = useRouter();
    const { getToken } = useAuth();

    useEffect(() => {
        const handleAuth = async () => {
            try {
                await login();
                router.push('/');
            } catch (error) {
                console.error('Authentication error:', error);
                router.push('/');
            }
        };

        handleAuth();
    }, [getToken, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="mb-4 text-2xl font-semibold">Completing Authentication...</h1>
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        </div>
    );
}
