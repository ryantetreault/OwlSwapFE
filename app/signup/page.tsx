import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 font-sans dark:from-[#1a1f3a] dark:via-[#0f1220] dark:to-[#232C64]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-[#232C64]/20 blur-3xl dark:bg-[#232C64]/40"></div>
        <div className="absolute -bottom-32 -right-20 h-150 w-150 animate-pulse rounded-full bg-blue-400/20 blur-3xl delay-1000 dark:bg-[#232C64]/30"></div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-6 h-32 w-32 drop-shadow-2xl">
            <Image
              src="/OwlSwapLogo-Transparent.png"
              alt="Owl Swap Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="mb-2 text-4xl font-extrabold text-[#232C64] dark:text-white">
            Join Owl Swap
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Create your account to start trading
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl bg-white/70 p-8 shadow-2xl backdrop-blur-sm dark:bg-slate-800/70">
          <SignUpForm />
        </div>

        <Link
          href="/"
          className="mt-6 text-sm text-slate-600 hover:underline dark:text-slate-400"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
