import { AuthCard } from "@/components/auth-component/AuthCard";
import { Metadata } from "next";

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

export default function AuthPage() {

  return (
    <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-primary bg-white shadow-md shadow-secondary">
      <AuthCard />
    </div>
  );
}
