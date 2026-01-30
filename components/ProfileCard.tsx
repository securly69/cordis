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
        <div className="w-[340px] rounded-lg overflow-hidden bg-[#313338] text-white shadow-xl">
            <div className="relative h-[120px] bg-[#5865F2]">
                {banner && (
                    <Image
                        src={banner}
                        alt="Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute -bottom-10 left-4">
                    <div className="relative">
                        <Image
                            src={image}
                            alt="Avatar"
                            width={80}
                            height={80}
                            className="rounded-full border-[6px] border-[#313338]"
                        />
                        <span
                            className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-[#313338] ${online ? 'bg-[#23A559]' : 'bg-[#80848E]'
                                }`}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-14 px-4 pb-4">
                <div className="flex flex-col gap-1">
                    <div className="text-xl font-semibold leading-none">
                        {displayName}
                    </div>
                    <div className="text-sm text-[#B5BAC1]">
                        @{username}
                    </div>
                </div>

                {quote && (
                    <div className="mt-3 italic text-sm text-[#DBDEE1]">
                        “{quote}”
                    </div>
                )}

                <div className="mt-4 bg-[#2B2D31] rounded-md p-3 text-sm">
                    <div className="flex flex-col gap-3">
                        {pronouns && (
                            <div>
                                <div className="text-xs uppercase text-[#B5BAC1] font-semibold">
                                    Pronouns
                                </div>
                                <div>{pronouns}</div>
                            </div>
                        )}

                        {bio && (
                            <div>
                                <div className="text-xs uppercase text-[#B5BAC1] font-semibold">
                                    About Me
                                </div>
                                <div className="text-[#DBDEE1] leading-snug">
                                    {bio}
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="text-xs uppercase text-[#B5BAC1] font-semibold">
                                Member Since
                            </div>
                            <div className="text-[#DBDEE1]">
                                {new Date(memberSince).toLocaleDateString(undefined, {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
