"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProviders } from "@/components/providers/QueryProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <QueryProviders>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProviders>
    </HeroUIProvider>
  );
}