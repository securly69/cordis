export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { clerkClient, auth } from '@clerk/nextjs/server'
import { StreamChat } from 'stream-chat'

const stream = StreamChat.getInstance(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
)

export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    const body = await req.json()
    const { displayName, image, bio, quote, pronouns, banner } = body

    await stream.upsertUsers([
        {
            id: userId,
            name: displayName,
            image,
            bio,
            quote,
            pronouns,
            banner
        } as unknown as import('stream-chat').UserResponse & Record<string, any>
    ])

    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            ...user.publicMetadata,
            profile: {
                ...(user.publicMetadata.profile as any),
                displayName,
                image,
                bio,
                quote,
                pronouns,
                banner,
            }
        }
    })

    return NextResponse.json({ success: true })
}
