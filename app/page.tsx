'use client'
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/nextjs"
import ProfileCard from "@/components/ProfileCard"

export default function Home() {
  const { user } = useUser()
  const [showProfile, setShowProfile] = useState(false)

  const profile = user?.publicMetadata?.profile as {
    banner?: string; bio?: string; quote?: string; pronouns?: string;
  } | undefined

  return (
    <div className="min-h-screen bg-[#404EED] font-sans selection:bg-black selection:text-[#404EED] overflow-x-hidden">
      {/* Navigation */}
      <nav className="relative z-50 w-full max-w-[1260px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-white text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#404EED] text-xs">D</span>
            </div>
            Discord
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <button className="hover:cursor-pointer bg-white text-black px-5 py-2 rounded-full font-medium text-sm hover:text-[#5865F2] transition-colors">
                Login
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4 relative">
              <SignOutButton>
                <button className="text-white text-sm font-medium hover:cursor-pointer hover:underline">
                  Sign Out
                </button>
              </SignOutButton>

              <button
                onClick={() => setShowProfile(!showProfile)}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-white hover:cursor-pointer transition-all"
              >
                <Image src={user?.imageUrl || ""} alt="Profile" fill />
              </button>

              {showProfile && user && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setShowProfile(false)} />
                  <div className="absolute right-0 top-12 z-[101]">
                    <ProfileCard
                      displayName={`${user.firstName} ${user.lastName || ""}`}
                      username={user.username || ""}
                      image={user.imageUrl}
                      banner={profile?.banner || null}
                      bio={profile?.bio || null}
                      quote={profile?.quote || null}
                      pronouns={profile?.pronouns || null}
                      memberSince={user.createdAt || new Date()}
                      online={true}
                    />
                  </div>
                </>
              )}
            </div>
          </SignedIn>
        </div>
      </nav>

      <main className="relative w-full">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Background"
            fill
            className="object-cover object-bottom opacity-40 pointer-events-none"
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-24 min-h-[calc(100vh-80px)]">
          <h1 className="text-white font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase max-w-5xl leading-[0.95] mb-8">
            {user ? `Welcome back, ${user.firstName}` : "Imagine a place..."}
          </h1>

          <p className="text-white text-lg md:text-xl leading-relaxed max-w-2xl mb-12 opacity-90">
            {user
              ? "Your servers are waiting for you. Jump back into the conversation and see what your friends have been up to."
              : "A place where you can belong to a school club, a gaming group, or a worldwide art community. Easy to talk every day and hang out more often."
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-20">
            <SignedIn>
              <Link href="/dashboard">
                <button className="bg-white text-black text-xl px-10 py-4 rounded-full font-medium hover:text-[#5865F2] hover:cursor-pointer hover:shadow-2xl transition-all w-full sm:w-auto">
                  Open Discord
                </button>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-up">
                <button className="bg-white text-black text-xl px-10 py-4 rounded-full font-medium hover:text-[#5865F2] hover:cursor-pointer hover:shadow-2xl transition-all w-full sm:w-auto">
                  Sign Up Now
                </button>
              </Link>
              <button className="bg-[#23272A] text-white text-xl px-10 py-4 rounded-full font-medium hover:bg-[#363a3f] hover:cursor-pointer transition-all w-full sm:w-auto">
                Download for Mac
              </button>
            </SignedOut>
          </div>

          {/* Feature List - Only visible when Signed Out */}
          <SignedOut>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full text-left mt-10">
              <FeatureItem
                title="Invite-only places"
                desc="Discord servers are organized into topic-based channels where you can collaborate and share."
              />
              <FeatureItem
                title="Where hanging out is easy"
                desc="Grab a seat in a voice channel when you’re free. Friends in your server can see you’re around."
              />
              <FeatureItem
                title="From few to a fandom"
                desc="Get any community running with moderation tools and custom member access."
              />
            </div>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
      <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/80 leading-relaxed">{desc}</p>
    </div>
  )
}