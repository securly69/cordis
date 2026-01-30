'use client'

import Image from 'next/image'

type ProfileCardProps = {
    displayName: string
    username: string
    image: string
    banner?: string | null
    bio?: string | null
    quote?: string | null
    pronouns?: string | null
    memberSince: string | number | Date
    online: boolean
}

export default function ProfileCard({
    displayName,
    username,
    image,
    banner,
    bio,
    quote,
    pronouns,
    memberSince,
    online
}: ProfileCardProps) {
    return (
        <div className="w-[360px] bg-[#1E1F22] text-white rounded-xl shadow-2xl">
            <div className="relative h-[120px] rounded-t-xl overflow-hidden bg-[#5865F2]">
                {banner && (
                    <Image
                        src={banner}
                        alt="Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                )}
            </div>

            <div className="relative px-4 pb-4">
                <div className="absolute -top-10 left-4">
                    <div className="relative w-20 h-20 rounded-full border-[6px] border-[#1E1F22] overflow-hidden">
                        <Image
                            src={image}
                            alt="Avatar"
                            fill
                            className="object-cover"
                        />
                        <span
                            className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-[#1E1F22] ${online ? 'bg-[#23A559]' : 'bg-[#80848E]'
                                }`}
                        />
                    </div>

                    {quote && (
                        <div className="absolute left-[90px] top-2 max-w-[220px] bg-[#2B2D31] text-sm px-3 py-2 rounded-lg">
                            <span className="absolute left-[-6px] top-4 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-[#2B2D31]" />
                            {quote}
                        </div>
                    )}
                </div>

                <div className="pt-14">
                    <div className="flex items-center gap-2">
                        <div className="text-xl font-semibold">
                            {displayName}
                        </div>
                        {pronouns && (
                            <span className="text-xs text-[#B5BAC1] bg-[#2B2D31] px-2 py-0.5 rounded">
                                {pronouns}
                            </span>
                        )}
                    </div>

                    <div className="text-sm text-[#B5BAC1]">
                        @{username}
                    </div>

                    {bio && (
                        <div className="mt-3 text-sm text-[#DBDEE1] leading-snug">
                            {bio}
                        </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#B5BAC1]">
                        Member since{' '}
                        {new Date(memberSince).toLocaleDateString(undefined, {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
