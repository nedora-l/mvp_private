"use client"
import type React from "react"
import { useSession } from "next-auth/react";
import { Dictionary } from "@/locales/dictionary";
import { redirect } from 'next/navigation';
import { useAuth } from "./contexts/auth-context";

type LoadingPageProps = {
  dictionary: Dictionary;
  locale: string;
}; 

export default function LoadingPage({
  dictionary,
  locale,
}: LoadingPageProps) {
  const {currentLoggedUser } = useAuth();
  const { data: session, status } = useSession();
  const currentUser = session?.user || null ;
  console.log("🔄 LoadingPage: Session sync effect triggered", status);
  if ((currentUser != null || currentLoggedUser != null)) {
    redirect(`/${locale}/app`);
  } else {
    redirect(`/${locale}/auth/login`);
  }
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-muted-foreground">{dictionary.common?.loading || "Loading"}...</p>
          </div>
        </main>
      </div>
    </div>
  )
}
