import { ForgotPasswordCard } from "@/components/auth-component/ForgotPasswordCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password by entering your email address. We&apos;ll send you a secure link to create a new password.",
  alternates: { canonical: "/auth/forgot-password" },
  openGraph: {
    title: "Forgot Password",
    description: "Reset your password by entering your email address. We&apos;ll send you a secure link to create a new password.",
    url: "/auth/forgot-password",
    images: [
      {
        url: "/og/forgot-password.png",
        width: 1200,
        height: 630,
        alt: "Reset your password by entering your email address. We&apos;ll send you a secure link to create a new password.",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {

  return (
    <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-primary bg-white shadow-md shadow-secondary">
      <ForgotPasswordCard />
    </div>
  );
}
