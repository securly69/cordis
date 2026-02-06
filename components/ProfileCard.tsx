'use client'
import Image from "next/image"

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
}: {
    displayName: string
    username: string
    image: string
    banner: string | null
    bio: string | null
    quote: string | null
    pronouns: string | null
    memberSince: Date
    online: boolean
}) {
    return (
        <div className="relative w-[340px] rounded-2xl overflow-hidden bg-[#1E1F22] text-white shadow-2xl border border-white/5">
            {banner && (
                <div className="relative h-28 w-full bg-[#2B2D31]">
                    <Image src={banner} alt="Banner" fill className="object-cover" />
                </div>
            )}

            <div className="relative px-4 pb-4">
                {/* Avatar Section */}
                <div className="absolute -top-12 left-4 flex items-center">
                    <div className="relative w-20 h-20 rounded-full bg-[#1E1F22] flex items-center justify-center p-1">
                        <Image
                            src={image}
                            alt="Avatar"
                            width={72}
                            height={72}
                            className="rounded-full"
                        />
                        {online && (
                            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#23A559] border-[3px] border-[#1E1F22]" />
                        )}
                    </div>
                    {/* Quote Bubble Section */}
                    {quote && (
                        <div className="absolute left-[92px] top-4 z-20 w-max min-w-[80px] max-w-[210px]">
                            {/* Main Bubble */}
                            <div className="relative bg-[#2B2D31] text-[13px] p-2.5 rounded-xl shadow-2xl border border-white/5 flex items-start gap-2">

                                {/* The Distinguished Tail (Sharp Triangle) */}
                                <div className="absolute -left-2 top-3 w-0 h-0 
                border-t-[6px] border-t-transparent 
                border-r-[10px] border-r-[#2B2D31] 
                border-b-[6px] border-b-transparent"
                                />

                                {/* Plus Icon - flex-shrink-0 is vital to prevent squishing */}
                                <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-[#4E5058] flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-gray-200">+</span>
                                </div>

                                {/* Quote Text - Wrapped tightly with 'anywhere' */}
                                <p className="text-gray-200 italic font-medium leading-tight [overflow-wrap:anywhere]">
                                    {quote}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="pt-12">
                    <div className="flex items-center gap-2 mt-2">
                        <h2 className="text-xl font-bold tracking-tight">{displayName}</h2>
                        {pronouns && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2B2D31] text-gray-300 uppercase">
                                {pronouns}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-gray-400 font-medium">@{username}</p>

                    {bio && (
                        <div className="mt-4 border-t border-white/5 pt-4">
                            <h3 className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
                                About Me
                            </h3>
                            <p className="text-[13px] text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
                                {bio}
                            </p>
                        </div>
                    )}

                    <div className="mt-4 text-[11px] font-semibold text-gray-500 uppercase tracking-tight">
                        Member since {memberSince.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
    )
}