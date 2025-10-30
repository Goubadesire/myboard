"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
