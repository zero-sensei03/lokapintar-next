import { PanelLayout } from "@/components/layouts/panel/PanelLayout";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <PanelLayout>
      {children}
    </PanelLayout>
  );
}
