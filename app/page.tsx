'use client'
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/nextjs"
import ProfileCard from "@/components/ProfileCard"
import { useStreamConnect } from "@/hooks/useStreamConnect"

export default function Home() {
  const { user } = useUser()
  const [showProfile, setShowProfile] = useState(false)
  const { connected } = useStreamConnect()

  const profile = user?.publicMetadata?.profile as {
    banner?: string; bio?: string; quote?: string; pronouns?: string; displayName?: string; image?: string;
  } | undefined

  const features = [
    "Real-time chat that just works.",
    "Simple, safe sign-in.",
    "Notifications — if you want them.",
    "Dashboard for your chats."
  ]

  const [typedText, setTypedText] = useState("")
  const [featureIndex, setFeatureIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (user) return

    const current = features[featureIndex]

    if (charIndex < current.length) {
      const t = setTimeout(() => {
        setTypedText(prev => prev + current[charIndex])
        setCharIndex(c => c + 1)
      }, 80)
      return () => clearTimeout(t)
    } else {
      const pause = setTimeout(() => {
        setTypedText("")
        setCharIndex(0)
        setFeatureIndex(i => (i + 1) % features.length)
      }, 2600)
      return () => clearTimeout(pause)
    }
  }, [charIndex, featureIndex, user])

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#5865F2_0%,transparent_25%),radial-gradient(circle_at_80%_0%,#404EED_0%,transparent_25%),radial-gradient(circle_at_50%_100%,#1e1f22_0%,transparent_30%)] opacity-40" />
      </div>

      <nav className="relative z-50 w-full max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#5865F2] to-[#404EED] flex items-center justify-center font-black">C</div>
          <span className="font-extrabold tracking-tight text-xl">Cordis</span>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <button className="hover:cursor-pointer px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-[#e6e6e6] transition">Sign In</button>
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4 relative">
              <SignOutButton>
                <button className="hover:cursor-pointer text-sm font-medium hover:underline">Sign Out</button>
              </SignOutButton>

              <button onClick={() => setShowProfile(!showProfile)} className="hover:cursor-pointer relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 hover:ring-white transition">
                <Image src={profile?.image || user?.imageUrl || ""} alt="Profile" fill />
              </button>

              {showProfile && user && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setShowProfile(false)} />
                  <div className="absolute right-0 top-12 z-[101]">
                    <ProfileCard
                      displayName={profile?.displayName || user.fullName || user.username || ""}
                      username={user.username || ""}
                      image={profile?.image || user.imageUrl}
                      banner={profile?.banner || "https://singlecolorimage.com/get/171a20/1200x300"}
                      bio={profile?.bio || null}
                      quote={profile?.quote || null}
                      pronouns={profile?.pronouns || null}
                      memberSince={user.createdAt || new Date()}
                      online={connected}
                    />
                  </div>
                </>
              )}
            </div>
          </SignedIn>
        </div>
      </nav>

      <main className="relative w-full max-w-[1280px] mx-auto px-6 pt-20 pb-28">
        <section className="text-center flex flex-col items-center">
          <h1 className="font-extrabold text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-8 min-h-[120px]">
            {user
              ? `Welcome back, ${profile?.displayName || user.username || "User"}!`
              : <>
                  {typedText}
                  <span className="ml-1 inline-block w-[2px] h-[0.9em] bg-white align-middle animate-caret" />
                </>
            }
          </h1>

          <SignedIn>
            <p className="text-lg md:text-xl max-w-2xl opacity-80 mb-12">
              Enjoy chatting!
            </p>
          </SignedIn>

          <SignedOut>
            <p className="text-lg md:text-xl max-w-2xl opacity-80 mb-12">
              Sign up to start chatting!
            </p>
          </SignedOut>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full justify-center">
            <SignedIn>
              <Link href="/dashboard">
                <button className="hover:cursor-pointer bg-gradient-to-r from-[#5865F2] to-[#404EED] px-10 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-[1.03] transition">
                  Open Dashboard
                </button>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-up">
                <button className="hover:cursor-pointer bg-gradient-to-r from-[#5865F2] to-[#404EED] px-10 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-[1.03] transition">
                  Get Started
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="hover:cursor-pointer bg-white/10 backdrop-blur px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition">
                  Sign In
                </button>
              </Link>
            </SignedOut>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mt-10">
          <FeatureCard title="Notifications — if you want them" desc="Turn on push in your browser and get pinged for new messages. No pressure, zero spam." icon="🔔" />
          <FeatureCard title="Clean UI" desc="See all chats cleanly and efficiently. No interruptions." icon="✨" />
          <FeatureCard title="Real-time messaging" desc="Instant delivery, typing indicators, presence, and smooth performance everywhere." icon="⚡" />
        </section>

        <section className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Simple, safe sign-in</h2>
            <p className="opacity-80 leading-relaxed">
              Sign in with your favorite account. No passwords to remember, no friction. Secure authentication that just works.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#5865F2]/30 to-[#404EED]/20 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">One clean dashboard</h2>
            <p className="opacity-80 leading-relaxed">
              Find out what you missed while you were away. Manage notifications and preferences from a single advanced interface designed for speed and clarity.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition shadow-xl">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="opacity-80 leading-relaxed">{desc}</p>
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#5865F2]/20 to-transparent pointer-events-none" />
    </div>
  )
}