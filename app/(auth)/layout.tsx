import Logo from "@/components/logo";
import React from "react";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Logo />
      {children}
    </div>
  );
}
