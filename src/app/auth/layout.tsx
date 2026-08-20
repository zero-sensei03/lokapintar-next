import { AuthLayout } from "@/components/layouts/auth/AuthLayout";
import { ReactNode } from "react";
import { Metadata } from "next";
import "@/assets/css/auth.css"

export const metadata: Metadata = {
  title: "Auth",
  description: "Sign in or Sign up to your account and continue your journey.",
  alternates: { canonical: "/auth" },
  openGraph: {
    title: "Auth",
    description: "Sign in or Sign up to your account and continue your journey.",
    url: "/auth",
    images: [
      {
        url: "/og/auth.png",
        width: 1200,
        height: 630,
        alt: "Sign in or Sign up to Your Brand",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}
