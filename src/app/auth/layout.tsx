import { AuthLayout } from "@/components/layouts/auth/AuthLayout";
import { ReactNode } from "react";
import "@/assets/css/auth.css"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}
