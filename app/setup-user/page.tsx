'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'

export default function SetupProfilePage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    const [displayName, setDisplayName] = useState('')
    const [bio, setBio] = useState('')
    const [quote, setQuote] = useState('')
    const [pronouns, setPronouns] = useState('')
    const [banner, setBanner] = useState('')
    const [avatarOverride, setAvatarOverride] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isLoaded || !user) return
        if (user.publicMetadata?.profileSetupComplete) {
            router.replace('/dashboard')
        }
        setDisplayName(user.fullName || user.username || '')
    }, [isLoaded, user, router])

    const avatar = useMemo(() => {
        if (avatarOverride) return avatarOverride
        if (user?.imageUrl) return user.imageUrl
        const letter = displayName?.[0]?.toUpperCase() || 'U'
        return `https://getstream.imgix.net/images/random_svg/${letter}.png`
    }, [avatarOverride, user, displayName])

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
        <div className="min-h-screen flex items-center justify-center bg-[#5865F2]">
            <div className="w-[420px] bg-[#313338] rounded-lg overflow-hidden shadow-2xl">
                <div className="relative h-28 bg-[#202225]">
                    {banner && (
                        <Image src={banner} alt="" fill className="object-cover" />
                    )}
                    <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-4 border-[#313338] overflow-hidden bg-[#202225]">
                        <Image src={avatar} alt="" fill className="object-cover" />
                    </div>
                </div>

                <div className="pt-14 px-6 pb-6 space-y-4">
                    <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Display name"
                        className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded"
                    />

                    <input
                        value={pronouns}
                        onChange={(e) => setPronouns(e.target.value)}
                        placeholder="Pronouns"
                        className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded"
                    />

                    <input
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        placeholder="Quote"
                        className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded"
                    />

                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Bio"
                        rows={3}
                        className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded resize-none"
                    />

                    <input
                        value={avatarOverride}
                        onChange={(e) => setAvatarOverride(e.target.value)}
                        placeholder="Avatar URL (optional)"
                        className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded"
                    />

                    <input
                        value={banner}
                        onChange={(e) => setBanner(e.target.value)}
                        placeholder="Banner URL (optional)"
                        className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded"
                    />

                    <button
                        disabled={!displayName || loading}
                        onClick={submit}
                        className="w-full bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white py-2 rounded font-medium"
                    >
                        {loading ? 'Saving…' : 'Finish'}
                    </button>
                </div>
            </div>
        </div>
    )
}
