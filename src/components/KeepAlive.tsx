'use client';

import { useKeepAliveSession } from '@/hooks/useKeepAliveSession';

export function KeepAlive() {
    useKeepAliveSession();
    return null;
}
