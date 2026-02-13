import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stream = StreamChat.getInstance(
        process.env.STREAM_API_KEY!,
        process.env.STREAM_SECRET_KEY!
    );

    const token = stream.createToken(userId);

    return NextResponse.json({ token, apiKey: process.env.STREAM_API_KEY });
}
