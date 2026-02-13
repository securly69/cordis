import { clerkClient } from '@clerk/nextjs/server';
import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // 1. Validate environment variables exist
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_SECRET_KEY;

    if (!apiKey || !apiSecret) {
      console.error("Missing Stream Environment Variables");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 2. Initialize Stream Admin Client
    const streamClient = StreamChat.getInstance(apiKey, apiSecret);

    // 3. Delete from Stream
    // Note: We use user_id here. 
    await streamClient.deleteUser(userId, { 
        delete_conversation_channels: true,
        hard_delete: true 
    });

    // 4. Delete from Clerk
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // This will now show up in your TERMINAL (VS Code)
    console.error('SERVER-SIDE ERROR:', error.message || error);
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 });
  }
}