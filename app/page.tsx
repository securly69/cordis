import Image from "next/image";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#404EED] font-sans selection:bg-black selection:text-[#404EED]">
      {/* Navigation */}
      <nav className="relative z-50 w-full max-w-[1260px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="text-white text-2xl font-black font-mono tracking-tighter">
            Discord
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 font-semibold text-white text-[16px]">
          <a href="#" className="hover:underline">Open In Browser</a>
          <a href="#" className="hover:underline">Discover</a>
          <a href="#" className="hover:underline">GitHub</a>
          <a href="#" className="hover:underline">Features</a>
          <a href="#" className="hover:underline">Integrations</a>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:text-[#5865F2] hover:shadow-lg transition-all duration-200">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative w-full overflow-hidden">
        {/* Background Image / Art */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Background"
            fill
            className="object-cover object-bottom opacity-90"
            priority
          />
        </div>

        {/* Content */}
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
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.84 9.49.5.09.68-.217.68-.485 0-.237-.009-.866-.014-1.699-2.78.602-3.369-1.339-3.369-1.339-.455-1.157-1.11-1.465-1.11-1.465-.909-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.89 1.529 2.34 1.089 2.91.833.09-.647.349-1.086.635-1.336-2.22-.251-4.555-1.111-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.097-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.307.679.914.679 1.838 0 1.325-.012 2.394-.012 2.72 0 .27.178.581.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Download for Mac
            </button>

            {/* Functional Sign Up Button presented as 'Open Discord' */}
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="bg-[#23272A] text-white text-xl px-8 py-4 rounded-full font-medium hover:bg-[#363a3f] hover:shadow-xl transition-all duration-200 w-full sm:w-auto justify-center">
                  Open Discord in your browser
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex gap-4">
                <button className="bg-[#23272A] text-white text-xl px-8 py-4 rounded-full font-medium hover:bg-[#363a3f] hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                  Open Discord
                </button>
              </div>
            </SignedIn>
          </div>
        </div>
      </main>
    </div>
  );
}
