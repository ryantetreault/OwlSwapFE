import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 font-sans dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <main className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-10 shadow-2xl dark:bg-zinc-900">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-32 w-32">
            <Image
              src="/OwlSwapLogo-Transparent.png"
              alt="Owl Swap Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              Owl Swap
            </h1>
            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Westfield State University
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center">
          <p className="text-base text-zinc-700 dark:text-zinc-300">
            Buy, sell, and trade with fellow Owls
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Your trusted campus marketplace
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <a
            href="/signin"
            className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="rounded-xl border-2 border-blue-600 bg-white px-6 py-3.5 text-center font-semibold text-blue-600 transition-all hover:bg-blue-50 dark:border-blue-500 dark:bg-zinc-900 dark:text-blue-400 dark:hover:bg-zinc-800"
          >
            Create Account
          </a>
        </div>

        {/* Footer */}
        <div className="mt-2 text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Exclusive to Westfield State University students
          </p>
        </div>
      </main>
    </div>
  );
}
