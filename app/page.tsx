'use client'
import { useState } from "react"; // Added for toggle logic
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import ProfileCard from "@/components/ProfileCard";

export default function Home() {
  const { user } = useUser();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-[#404EED] font-sans selection:bg-black selection:text-[#404EED]">
      <nav className="relative z-50 w-full max-w-[1260px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Section */}
          <svg className="w-10 h-10 text-white" viewBox="0 0 71 55" fill="currentColor">
            <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
          </svg>
          <div className="text-white text-2xl font-black font-mono tracking-tighter">Discord</div>
        </div>

        <div className="flex items-center gap-4 relative">
          <SignedOut>
            <Link href="/sign-in">
              <button className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:text-[#5865F2] hover:shadow-lg transition-all duration-200">
                Login
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            {user && (
              <div className="relative">
                {/* Trigger Button: Profile Image */}
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-white transition-all"
                >
                  <Image
                    src={user.imageUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </button>

                {/* The Profile Card Modal/Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-4 z-[100] shadow-2xl animate-in fade-in zoom-in duration-200">
                    <ProfileCard
                      displayName={`${user.firstName} ${user.lastName || ""}`}
                      username={user.username || ""}
                      image={user.imageUrl}
                      banner={(user.publicMetadata?.banner as string) || null}
                      bio={(user.publicMetadata?.bio as string) || null}
                      quote={(user.publicMetadata?.quote as string) || null}
                      pronouns={(user.publicMetadata?.pronouns as string) || null}
                      memberSince={user.createdAt || new Date()}
                      online={true}
                    />
                    {/* Backdrop to close when clicking away */}
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setShowProfile(false)}
                    />
                  </div>
                )}
              </div>
            )}
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Background"
            fill
            className="object-cover object-bottom opacity-90"
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-20 md:pt-32 md:pb-56 min-h-[calc(100vh-80px)]">
          <h1 className="text-white font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase max-w-4xl leading-[0.95] mb-8 font-sans">
            Imagine a place...
          </h1>
          <p className="text-white text-lg md:text-xl leading-relaxed max-w-2xl mb-12 opacity-90">
            ...where you can belong to a school club, a gaming group, or a worldwide art community.
            Where just you and a handful of friends can spend time together. A place that makes it easy
            to talk every day and hang out more often.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
            <button className="bg-white text-black text-xl px-8 py-4 rounded-full font-medium flex items-center gap-3 hover:text-[#5865F2] hover:shadow-xl transition-all duration-200 w-full sm:w-auto justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Download for Mac
            </button>

            <SignedOut>
              <Link href="/sign-up">
                <button className="bg-[#23272A] text-white text-xl px-8 py-4 rounded-full font-medium hover:bg-[#363a3f] hover:shadow-xl transition-all duration-200 w-full sm:w-auto justify-center">
                  Open Discord in your browser
                </button>
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex gap-4">
                <Link href="/dashboard">
                  <button className="bg-[#23272A] text-white text-xl px-8 py-4 rounded-full font-medium hover:bg-[#363a3f] hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                    Open Discord
                  </button>
                </Link>
              </div>
            </SignedIn>
          </div>
        </div>
      </main>
    </div>
  );
}
