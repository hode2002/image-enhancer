'use client';

import { useEffect, useRef } from 'react';

export function useKeepAliveSession(intervalMs = 5 * 60 * 1000) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(async () => {
            try {
                await fetch('/api/ping');
            } catch (err) {
                console.warn('Ping failed', err);
            }
        }, intervalMs);
    };

    const stop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                start();
            } else {
                stop();
            }
        };

        if (document.visibilityState === 'visible') {
            start();
        }

        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            stop();
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);
}
