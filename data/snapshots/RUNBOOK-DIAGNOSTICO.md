# RUNBOOK · "diagnóstico marketing"

Quando o Mauricio escreve **"diagnóstico marketing"** (ou variações abaixo),
o Claude gera um **relatório executivo em Word** com análise consolidada de
todas as estratégias de marketing digital, no padrão validado em 22/jun/2026.

## Triggers aceitos (todos disparam o mesmo fluxo)

- "diagnóstico marketing" / "diagnostico marketing"
- "análise de marketing" / "analise de marketing"
- "relatório de marketing" / "relatorio de marketing"
- "como está nosso marketing" / "como esta nosso marketing"
- "auditoria de marketing"

## Diferença pra "atualiza o dashboard"

| Comando | Output |
|---|---|
| **atualiza o dashboard** | JSON snapshot + commit no repo → dashboard live |
| **diagnóstico marketing** | **Word executivo** entregue no chat com análise+recomendações |

## Fluxo

### 1. Capturar dados frescos (Chrome MCP)

Todas as abas precisam estar logadas. Período padrão: **últimos 30 dias** para mídia paga, **últimos 3 meses** para GSC, **últimos 7 dias** para GA4.

- [ ] **Google Ads** (`ads.google.com/aw/overview`)
  - Visão geral: cliques, impressões, custo, CPC médio, conversões, CTR
  - Tabela de campanhas (`/aw/campaigns`): por campanha — impr, cliques, CTR, custo, CPC, conversões, opt score, status
  - DOM scrape via `document.querySelectorAll('tr, [role="row"]')`

- [ ] **Search Console** (`search.google.com/search-console`)
  - Período 3 meses: cliques totais, impressões totais, CTR média, posição média
  - Top 10 queries com clicks/imp/posição
  - Marcar brand vs descoberta (regra: contém "diletta" = brand)
  - Variação vs leitura anterior (puxar do JSON snapshot mais recente)

- [ ] **Google Analytics 4** (`analytics.google.com`)
  - 7 dias: usuários ativos, visualizações, contagem de eventos, generate_lead, vs período anterior em %
  - Tendência: subindo / estável / caindo
  - Validar se `generate_lead > 0` — se zero, MARCAR COMO CRÍTICO

- [ ] **LinkedIn Ads** (`linkedin.com/campaignmanager`)
  - Conta level 30d: investimento USD, impressões, cliques, CTR, CPC, leads
  - Por conjunto: nome, status (Ativa / Em rascunho / Desativada), métricas
  - Marcar campanhas em rascunho como CRÍTICO se for Lead Gen

### 2. Diagnóstico estruturado

Para cada canal, classificar como:

| Símbolo | Significado |
|---|---|
| ✅ | Funcionando bem (acima de benchmark) |
| ⚠️ | Aceitável mas pode melhorar |
| 🟥 | Crítico, exige ação imediata |

Benchmarks de referência (Brasil 2026):
- Google Ads Search B2B: CPC R$ 4-7, CTR 3-7%
- LinkedIn Ads B2B: CTR 0,4-0,9%, CPC US$ 2-8
- GSC: CTR média 3-5%, posição média 5-15

### 3. Gerar Word (.docx)

Estrutura obrigatória (com numeração — N capítulos = padrão validado):

1. **Capa** — título "Onde estamos. O que está funcionando. O que precisa parar agora." + período + data
2. **Sumário executivo** (TL;DR) — 3 descobertas críticas + 3 pontos positivos
3. **Google Ads** — visão conta + tabela por campanha + diagnóstico em bullets
4. **Google Search Console** — visão + top 10 queries brand vs descoberta + diagnóstico
5. **Google Analytics 4** — KPIs 7d + variação % + diagnóstico (atenção tracking)
6. **LinkedIn Ads** — conta level + status de cada conjunto + diagnóstico
7. **Diagnóstico transversal** — o que funciona / o que está quebrado / CPL atual
8. **Recomendações priorizadas** — 72h / 2 semanas / 4 semanas / 60 dias
9. **Resumo em uma página** — fechamento executivo

Brand visual:
- Cor accent: `#E60000` (red) usado só em destaque e bordas H1
- Fonte: Calibri 11pt corpo, 16pt H1
- Texto principal: `#3F3946`
- Cinza header tabelas: `#EDE9F0`
- Verde positivo: `#0E8A4D`
- Vermelho crítico: `#E60000`
- Bullets sempre via `LevelFormat.BULLET` (nunca unicode)
- Tabelas com DXA, nunca PERCENTAGE
- ShadingType.CLEAR

### 4. Output entregue ao Mauricio

Arquivo: `diletta-analise-marketing-{MMM}{AAAA}.docx` (ex: `diletta-analise-marketing-jun2026.docx`)

Apresentar com:
- Resumo TL;DR no chat (3 críticos + 3 positivos)
- Link `computer://` pro Word
- Lista das 3 ações de 72h

### 5. Não confundir com

- **"atualiza o dashboard"** → snapshot JSON + commit, não Word
- **"como está minha conversão"** → puxa só GA4 + Pipedrive
- **"audit Google Ads"** → análise profunda só de uma plataforma
