// Resend wrapper. Fail-safe: if RESEND_API_KEY missing in dev, logs link.

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "Diletta BI <notify@dilettasolutions.io>";

export async function sendMagicLinkEmail(to: string, link: string) {
  if (!RESEND_KEY) {
    console.log(`[DEV] Magic link for ${to}: ${link}`);
    return { ok: true, dev: true };
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: "Seu link de acesso · Diletta BI",
      html: html(link),
      text: text(link),
    }),
  });
  if (!r.ok) {
    const err = await r.text();
    console.error("Resend error:", r.status, err);
    return { ok: false, error: `Resend ${r.status}` };
  }
  return { ok: true };
}

function html(link: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;background:#08050A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#EDE9F0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#08050A;padding:48px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" style="max-width:520px;background:#0E0A12;border:1px solid #1F1A26;border-radius:12px;padding:40px;">
<tr><td>
<div style="display:inline-block;width:48px;height:48px;background:#E60000;border-radius:8px;text-align:center;line-height:48px;font-weight:700;font-size:24px;color:#fff;">D</div>
<h1 style="margin:20px 0 8px;font-size:24px;font-weight:600;font-family:Georgia,'Times New Roman',serif;color:#fff;">Entre no Diletta BI</h1>
<p style="margin:0 0 24px;color:#A29DAB;font-size:14px;">Clique no botão abaixo para entrar. O link expira em 15 minutos.</p>
<a href="${link}" style="display:inline-block;background:#E60000;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Entrar no painel</a>
<p style="margin:32px 0 0;color:#6B6573;font-size:12px;line-height:1.6;">Se você não pediu este link, ignore este email.<br>Se o botão não funcionar, copie e cole esta URL:<br><span style="color:#A29DAB;word-break:break-all;">${link}</span></p>
</td></tr></table>
<p style="margin:24px 0 0;color:#6B6573;font-size:11px;">Diletta Solutions · dilettasolutions.com</p>
</td></tr></table></body></html>`;
}

function text(link: string): string {
  return `Entre no Diletta BI\n\nClique no link abaixo para entrar. Expira em 15 minutos.\n\n${link}\n\nSe você não pediu este link, ignore este email.\n\n— Diletta Solutions`;
}
