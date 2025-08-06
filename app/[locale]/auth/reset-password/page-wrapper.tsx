"use client"
import { Suspense } from "react";
import ResetPasswordForm from "./page";

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
