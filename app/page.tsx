import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 font-sans dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-[#232C64]/20 blur-3xl dark:bg-[#232C64]/40"></div>
        <div className="absolute -bottom-32 -right-20 h-[600px] w-[600px] animate-pulse rounded-full bg-blue-400/20 blur-3xl delay-1000 dark:bg-[#232C64]/30"></div>
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#232C64]/15 blur-3xl delay-500 dark:bg-blue-500/20"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Logo with glow effect */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-6 h-48 w-48 drop-shadow-2xl transition-transform hover:scale-105 sm:h-56 sm:w-56">
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#232C64]/30 blur-2xl dark:bg-[#232C64]/50"></div>
            <Image
              src="/OwlSwapLogo-Transparent.png"
              alt="Owl Swap Logo"
              fill
              className="relative object-contain"
              priority
            />
          </div>

          {/* Title section */}
          <div className="mb-4 text-center">
            <h1 className="mb-2 text-6xl font-extrabold text-[#232C64] drop-shadow-sm dark:text-white sm:text-7xl">
              Owl Swap
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#232C64]/60 dark:to-blue-400/60"></div>
              <p className="text-lg font-semibold text-[#232C64] dark:text-blue-300">
                Westfield State University
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#232C64]/60 dark:to-blue-400/60"></div>
            </div>
          </div>

          {/* Description */}
          <p className="mb-2 max-w-md text-center text-xl font-medium text-slate-700 dark:text-slate-200">
            Your campus marketplace awaits
          </p>
          <p className="max-w-lg text-center text-base text-slate-600 dark:text-slate-300">
            Buy, sell, and trade with fellow Owls in a trusted community
          </p>
        </div>

        {/* Buttons */}
        <div className="flex w-full max-w-sm flex-col gap-4 sm:flex-row sm:gap-4">
          <a
            href="/signin"
            className="group relative overflow-hidden rounded-2xl bg-[#232C64] px-8 py-4 text-center text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-[#1a2350] hover:shadow-2xl dark:bg-[#232C64] dark:hover:bg-[#2d3a7a]"
          >
            <span className="relative z-10">Sign In</span>
          </a>
          <a
            href="/signup"
            className="group rounded-2xl border-2 border-[#232C64] bg-white/80 px-8 py-4 text-center text-lg font-bold text-[#232C64] shadow-xl backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:shadow-2xl dark:border-blue-400 dark:bg-slate-800/80 dark:text-blue-300 dark:hover:bg-slate-800"
          >
            Create Account
          </a>
        </div>

        {/* Features */}
        <div className="mt-16 grid max-w-4xl grid-cols-1 gap-6 px-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/70 p-6 text-center backdrop-blur-sm transition-transform hover:scale-105 dark:bg-slate-800/70">
            <div className="mb-3 text-4xl">🛍️</div>
            <h3 className="mb-2 font-bold text-[#232C64] dark:text-slate-100">
              Buy & Sell
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Find great deals from students on campus
            </p>
          </div>
          <div className="rounded-2xl bg-white/70 p-6 text-center backdrop-blur-sm transition-transform hover:scale-105 dark:bg-slate-800/70">
            <div className="mb-3 text-4xl">🦉</div>
            <h3 className="mb-2 font-bold text-[#232C64] dark:text-slate-100">
              Owls Only
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Exclusive to Westfield State students
            </p>
          </div>
          <div className="rounded-2xl bg-white/70 p-6 text-center backdrop-blur-sm transition-transform hover:scale-105 dark:bg-slate-800/70">
            <div className="mb-3 text-4xl">🔒</div>
            <h3 className="mb-2 font-bold text-[#232C64] dark:text-slate-100">
              Safe & Secure
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Trade safely within your campus community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
