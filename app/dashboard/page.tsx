'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useStreamConnect } from '@/hooks/useStreamConnect'
import { useTheme } from "next-themes"

export default function Dashboard() {
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()
    const { client, connected } = useStreamConnect()

    // Theme Hook
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // States for Preferences
    const [unreadCount, setUnreadCount] = useState(0)
    const [notifications, setNotifications] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (connected && client?.user) {
            setUnreadCount((client.user as any).total_unread_count || 0)
        }
    }, [connected, client])

    if (!isLoaded || !user) {
        return (
            <div className="min-h-screen bg-[#1e1f22] flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    // Use resolvedTheme to determine dark mode status. 
    // Default to true (dark) if not mounted to prevent flash or match default.
    const isDarkMode = mounted ? resolvedTheme === 'dark' : true

    // --- Logic: Last Login Calculation ---
    const lastSignIn = user.lastSignInAt ? new Date(user.lastSignInAt) : new Date()
    const daysAgo = Math.floor((new Date().getTime() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24))

    // --- Logic: Delete Account ---
    const handleDeleteAccount = async () => {
        const confirmed = confirm("Are you sure? This will permanently delete your Clerk and Stream data.")
        if (!confirmed) return

        setIsDeleting(true)
        try {
            const response = await fetch('/api/user/delete', {
                method: 'POST',
                body: JSON.stringify({ userId: user.id }),
            })

            if (response.ok) {
                await signOut() // Sign out the user locally after deletion
                window.location.href = "/"
            } else {
                alert("Failed to delete account. Please try again.")
            }
        } catch (error) {
            console.error("Deletion error:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const name = (user.publicMetadata?.profile as any)?.displayName || user.firstName || 'User'

    return (
        <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#1e1f22] text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <img src={user.imageUrl} alt="Profile" className="h-16 w-16 rounded-full ring-4 ring-[#5865F2]/40" />
                        <div>
                            <h1 className="text-4xl font-bold">Welcome, {name}</h1>
                            <p className={isDarkMode ? "text-[#b5bac1]" : "text-gray-500"}>
                                Last login: {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* MAIN NAVIGATION */}
                    <Link href="/channels/@me" className="md:col-span-2 bg-gradient-to-br from-[#5865F2] to-[#7983f5] p-8 rounded-3xl shadow-xl hover:scale-[1.01] transition text-white">
                        <h2 className="text-3xl font-bold mb-2">Direct Messages</h2>
                        <div className="text-5xl font-black">{unreadCount}</div>
                        <p className="opacity-80">Unread messages</p>
                    </Link>

                    {/* PREFERENCES CORNER */}
                    <div className={`${isDarkMode ? 'bg-[#2b2d31]' : 'bg-white'} p-6 rounded-3xl shadow-xl space-y-4`}>
                        <h3 className="font-bold text-xl mb-4">Preferences</h3>

                        <div className="flex items-center justify-between">
                            <span>Dark Mode</span>
                            <button
                                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                                className={`hover:cursor-pointer w-12 h-6 rounded-full transition ${isDarkMode ? 'bg-[#5865F2]' : 'bg-gray-400'} relative`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>Notifications</span>
                            <button onClick={() => setNotifications(!notifications)} className={`hover:cursor-pointer w-12 h-6 rounded-full transition ${notifications ? 'bg-green-500' : 'bg-gray-400'} relative`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <hr className={isDarkMode ? "border-gray-700" : "border-gray-200"} />

                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="w-full py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        >
                            {isDeleting ? "Deleting..." : "Delete Account"}
                        </button>
                    </div>
                </div>

                {/* SECONDARY NAVIGATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/channels" className={`${isDarkMode ? 'bg-[#2b2d31] hover:bg-[#32353b]' : 'bg-white hover:bg-gray-50'} p-8 rounded-3xl shadow-xl transition`}>
                        <h2 className="text-3xl font-bold mb-2">Channels</h2>
                        <p className={isDarkMode ? "text-[#b5bac1]" : "text-gray-500"}>Browse servers and group chats</p>
                    </Link>

                    <div className="flex items-end justify-end">
                        <Link href="/edit-user" className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-8 py-4 rounded-2xl font-bold transition shadow-lg">
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}