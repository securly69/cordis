'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

export function useStreamConnect() {
    const { user, isLoaded } = useUser();
    const [client, setClient] = useState<StreamChat | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!isLoaded || !user) return;

        let chatClient: StreamChat;

        const connect = async () => {
            try {
                // Get token from our backend
                const response = await fetch('/api/token', { method: 'POST' });
                const { token, apiKey } = await response.json();

                if (!token) return;

                chatClient = StreamChat.getInstance(apiKey);

                await chatClient.connectUser(
                    {
                        id: user.id,
                        name: (user.publicMetadata?.profile as any)?.displayName || user.fullName || user.username || 'User',
                        image: (user.publicMetadata?.profile as any)?.image || user.imageUrl,
                    },
                    token
                );

                setClient(chatClient);
                setConnected(true);
            } catch (error) {
                console.error('Failed to connect to Stream:', error);
            }
        };

        connect();

        return () => {
            if (chatClient) {
                chatClient.disconnectUser();
            }
        };
    }, [user, isLoaded]);

    return { client, connected };
}
