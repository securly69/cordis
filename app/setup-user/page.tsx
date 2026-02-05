'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { UploadButton } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"

export default function SetupProfilePage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    const [displayName, setDisplayName] = useState('')
    const [bio, setBio] = useState('')
    const [quote, setQuote] = useState('')
    const [pronouns, setPronouns] = useState('')

    // Media States
    const [banner, setBanner] = useState('')
    const [customAvatar, setCustomAvatar] = useState('')
    const [avatarType, setAvatarType] = useState<'clerk' | 'stream' | 'custom'>('clerk')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isLoaded || !user) return
        if (user.publicMetadata?.profileSetupComplete) {
            router.replace('/dashboard')
        }
        setDisplayName(user.fullName || user.username || '')
    }, [isLoaded, user, router])

    const avatar = useMemo(() => {
        if (avatarType === 'custom' && customAvatar) return customAvatar
        if (avatarType === 'stream') {
            const letter = displayName?.[0]?.toUpperCase() || 'U'
            return `https://getstream.io/random_png/?name=${letter}`
        }
        return user?.imageUrl || ''
    }, [avatarType, customAvatar, user, displayName])

    async function submit() {
        if (!displayName || loading) return
        setLoading(true)

        const res = await fetch('/api/profile/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                displayName,
                image: avatar,
                bio,
                quote,
                pronouns,
                banner
            })
        })

        if (res.ok) router.replace('/dashboard')
        setLoading(false)
    }

    if (!isLoaded || !user) return null

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#5865F2] p-4">
            <div className="w-full max-w-[420px] bg-[#313338] rounded-lg overflow-hidden shadow-2xl">

                {/* Banner Section */}
                <div className="relative h-28 bg-[#202225] flex items-center justify-center">
                    {banner ? (
                        <Image src={banner} alt="" fill className="object-cover" />
                    ) : (
                        <span className="text-gray-500 text-xs font-bold uppercase">No Banner</span>
                    )}

                    <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition">
                        <UploadButton
                            endpoint="bannerUploader" // Matches your FileRouter endpoint
                            onClientUploadComplete={(res) => setBanner(res[0].url)}
                            appearance={{
                                button: "bg-[#313338] text-[10px] px-2 h-8 after:bg-none",
                                allowedContent: "hidden"
                            }}
                            content={{ button: "Upload Banner" }}
                        />
                    </div>

                    {/* Avatar Circle */}
                    <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-4 border-[#313338] overflow-hidden bg-[#202225] z-10">
                        <Image src={avatar} alt="" fill className="object-cover" />
                    </div>
                </div>

                <div className="pt-14 px-6 pb-6 space-y-5">

                    {/* Avatar Selector */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Profile Picture</label>
                        <div className="flex gap-2 p-1 bg-[#1e1f22] rounded-md">
                            {(['clerk', 'stream', 'custom'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setAvatarType(type)}
                                    className={`flex-1 py-1 text-xs rounded transition ${avatarType === type ? 'bg-[#5865F2] text-white' : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        {avatarType === 'custom' && (
                            <UploadButton
                                endpoint="avatarUploader"
                                onClientUploadComplete={(res) => setCustomAvatar(res[0].url)}
                                appearance={{
                                    button: "w-full bg-[#1e1f22] border border-dashed border-gray-600 text-xs h-10",
                                    allowedContent: "text-[10px]"
                                }}
                            />
                        )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                        <input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Display name"
                            className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded focus:outline-none"
                        />
                        <div className="flex gap-2">
                            <input
                                value={pronouns}
                                onChange={(e) => setPronouns(e.target.value)}
                                placeholder="Pronouns"
                                className="w-1/3 bg-[#1e1f22] text-white px-3 py-2 rounded focus:outline-none"
                            />
                            <input
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                placeholder="Quote / Status"
                                className="w-2/3 bg-[#1e1f22] text-white px-3 py-2 rounded focus:outline-none"
                            />
                        </div>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Bio"
                            rows={3}
                            className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded resize-none focus:outline-none"
                        />
                    </div>

                    <button
                        disabled={!displayName || loading}
                        onClick={submit}
                        className="w-full bg-[#248046] hover:bg-[#1a6334] disabled:opacity-50 text-white py-2 rounded font-medium transition"
                    >
                        {loading ? 'Saving...' : 'Complete Setup'}
                    </button>
                </div>
            </div>
        </div>
    )
}