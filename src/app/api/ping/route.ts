import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const { userId, sessionId } = await auth();

    if (!userId || !sessionId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    return new NextResponse('OK', { status: 200 });
}
