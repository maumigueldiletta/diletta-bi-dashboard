# REGRAS PERMANENTES · Git & Deploy

Regras que valem pra TODOS os repos da Diletta (dilettanewsite, dilettanewsite-blog, diletta-bi-dashboard, etc).

## 1. Email obrigatório de commit

**TODOS os commits feitos pelo Claude DEVEM usar:**

```
Mauricio Miguel <m.miguel@dilettasolutions.com>
```

**NUNCA usar:**
- `maumiguel82@gmail.com` (Gmail pessoal — não vinculado ao Vercel team)
- `beautiful-busy-pasteur@claude.(none)` (default do sandbox)
- Qualquer outro email

**Motivo:** o Vercel bloqueia deploys cuja autoria não bate com a team `Mauricio's projects`. Commit com email errado vira deploy **Blocked** + Mauricio recebe notificação por email.

## 2. Comando git correto

Sempre:

```bash
git -c user.email=m.miguel@dilettasolutions.com -c user.name="Mauricio Miguel" \
  commit -m "mensagem"
```

Pra push pra repos privados, usar o PAT do Mauricio (Settings → Tokens). Após uso, **revogar PAT** (security best practice).

## 3. Aplicação

Esta regra se aplica em:

- `maumigueldiletta/dilettanewsite` (site institucional)
- `maumigueldiletta/dilettanewsite-blog` (blog)
- `maumigueldiletta/diletta-bi-dashboard` (este repo)
- Qualquer repo novo que o Claude criar pra Diletta

Vale também pra **commit amend**: se um commit anterior usou email errado, fazer:

```bash
git -c user.email=m.miguel@dilettasolutions.com -c user.name="Mauricio Miguel" \
  commit --amend --author="Mauricio Miguel <m.miguel@dilettasolutions.com>" -C HEAD
git push --force-with-lease
```
