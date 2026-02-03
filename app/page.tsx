export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col gap-8 rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Owl Swap
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome to Owl Swap
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href="/signin"
            className="rounded-lg bg-black px-4 py-3 text-center font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="rounded-lg border border-black bg-white px-4 py-3 text-center font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Sign Up
          </a>
        </div>
      </main>
    </div>
  );
}
