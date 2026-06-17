"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginInner() {
  const params = useSearchParams();
  const error = params.get("error");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErrMsg(null);
    try {
      const r = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) {
        setErrMsg("Não conseguimos enviar o link agora. Tente novamente em alguns minutos.");
      } else {
        setSent(true);
      }
    } catch {
      setErrMsg("Falha de rede. Tenta de novo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-diletta-bg px-4">
      <div className="w-full max-w-md rounded-xl border border-diletta-line bg-diletta-bg2 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-diletta-red text-2xl font-bold text-white">D</div>
        <h1 className="mt-6 font-serif text-3xl font-semibold">Diletta BI</h1>
        <p className="mt-2 text-sm text-diletta-text3">Painel de marketing · acesso restrito</p>

        {sent ? (
          <div className="mt-8 rounded-md border border-diletta-line bg-diletta-bg p-5 text-sm">
            <p className="font-semibold text-diletta-text">Link enviado.</p>
            <p className="mt-2 text-diletta-text3">
              Se o email <span className="text-diletta-text">{email}</span> estiver autorizado, você vai receber um link de acesso em alguns segundos. O link expira em 15 minutos.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-4 text-xs text-diletta-text3 underline hover:text-diletta-text"
            >
              Usar outro email
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-3">
            <input
              type="email"
              required
              autoFocus
              placeholder="seu@dilettasolutions.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-diletta-line bg-diletta-bg px-4 py-3 text-sm text-diletta-text placeholder:text-diletta-text3 focus:border-diletta-red focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !email}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-diletta-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-diletta-red2 disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Receber link de acesso"}
            </button>
          </form>
        )}

        {error === "invalid_link" && !sent && (
          <p className="mt-4 text-xs text-red-400">
            Link expirado ou inválido. Peça um novo.
          </p>
        )}
        {errMsg && <p className="mt-4 text-xs text-red-400">{errMsg}</p>}

        <p className="mt-6 text-xs text-diletta-text3">
          Restrito a emails autorizados · Sem senha, apenas link único por email
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
