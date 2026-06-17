"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginInner() {
  const params = useSearchParams();
  const error = params.get("error");
  return (
    <div className="grid min-h-screen place-items-center bg-diletta-bg">
      <div className="w-full max-w-md rounded-xl border border-diletta-line bg-diletta-bg2 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-diletta-red text-2xl font-bold text-white">D</div>
        <h1 className="mt-6 font-serif text-3xl font-semibold">Diletta BI</h1>
        <p className="mt-2 text-sm text-diletta-text3">Painel de marketing · acesso restrito</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-md bg-diletta-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-diletta-red2"
        >
          Entrar com Google
        </button>
        {error && (
          <p className="mt-4 text-xs text-red-400">
            Acesso negado. Use seu e-mail @dilettasolutions.com.
          </p>
        )}
        <p className="mt-6 text-xs text-diletta-text3">
          Restrito a emails autorizados · Cookies essenciais
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
