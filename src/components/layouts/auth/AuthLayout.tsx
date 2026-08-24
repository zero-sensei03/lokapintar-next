"use client";

import { AnimatedBackground } from "@/components/auth-component/AnimatedBackground";
import { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page relative min-h-screen overflow-hidden bg-[#FFF9F6] text-foreground">
      {/* Background Animated Layer */}
      <AnimatedBackground />

      <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px]">
          {/* BRAND */}
          <div className="mb-7 flex items-center gap-2">
            <div className="flex justify-center">
              <div className="relative flex h-[74px] w-[74px] items-center justify-center">
                <div className="logo-orbit absolute inset-0 rounded-full border border-[#FF9F43]/40" />
                <div className="absolute inset-[9px] rounded-full border border-[#FF5E3A]/30" />
                <div className="logo-core relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF5E3A]/20 bg-white shadow-sm">
                  <div className="h-4 w-4 rotate-45 rounded-[4px] border-2 border-[#FF5E3A]" />
                  <div className="absolute h-1.5 w-1.5 rounded-full bg-[#FF9F43]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </h1>
              <p className="sm:text-sm text-xs text-muted">
                A quiet place for your digital world.
              </p>
            </div>
          </div>

          {children}

          <p className="mt-6 text-center text-[10px] text-muted">
            © 2026 {(new Date().getFullYear()) === 2026 ? "" : `- ${new Date().getFullYear()}`} {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}