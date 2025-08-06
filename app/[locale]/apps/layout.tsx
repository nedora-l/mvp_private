import type React from "react";

interface AppsLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function AppsLayout({
  children,
  params,
}: AppsLayoutProps) {
  const { locale } = await params;
  return <>{children}</>;
}
