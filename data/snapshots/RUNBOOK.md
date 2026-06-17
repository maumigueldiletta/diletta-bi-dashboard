# RUNBOOK · "atualiza o dashboard"

Quando o Mauricio escreve **"atualiza o dashboard"**, **"puxa dados de hoje"** ou
**"atualiza tudo"**, o Claude faz **todo** o roteiro abaixo, sem perguntar.

## Checklist completo

### 1. Google Ads (tabId Google Ads)
- [ ] **Visão geral** (último 30d): cliques, impressões, CPC médio, custo total
- [ ] **Campanhas**: nome, status, cliques, custo, conversões, CPC, CTR por campanha (3 campanhas: A Squad/IA, B Fintech, [UMB])
- [ ] **Insights/Search Terms**: top 10 termos com cliques e custos
- [ ] **Recomendações**: número pendentes + Optimization Score %

### 2. Google Search Console (tabId GSC)
- [ ] **Desempenho 3 meses**: cliques, impressões, CTR média, posição média
- [ ] **Top queries** (até 20): query, cliques, impressões, posição, marcar isBrand
- [ ] **Top pages**: URL, cliques, impressões
- [ ] **Alertas**: indexação bloqueada, erros de cobertura

### 3. Google Analytics 4 (tabId GA4)
- [ ] **Página inicial 7d**: usuários ativos, visualizações, contagem de eventos
- [ ] **Aquisição → Aquisição de tráfego (30d)**: top 6 canais por sessions/users
- [ ] **Eventos**: total generate_lead, calendly_book_completed (Key Events)
- [ ] **Engajamento**: taxa de engajamento

### 4. LinkedIn Ads (tabId Campaign Manager)
- [ ] **Conjuntos de anúncios**: nome, status, resultados, despesa, CPC, CTR por conjunto
- [ ] **Demographics**: top job titles, top industries (se disponível)
- [ ] **Performance posts**: melhor anúncio (CTR, engajamento)

### 5. Pipedrive (via MCP `pipedrive-list-deals`)
- [ ] Total deals open / weighted pipeline value
- [ ] Stage distribution (Discovery, Proposta, Negociação, Won)
- [ ] Top 5 deals por valor com nome/empresa/estágio

### 6. Instantly (tabId Instantly se logado)
- [ ] **Warmup status**: dilettasolutions.io inbox dias restantes
- [ ] **Campanha E1-E4**: sent, opens, replies, bounces

### 7. Formspree (tabId Formspree)
- [ ] **Submissões** (últimos 30d): número total, último submission timestamp

## Fluxo de execução

1. Recolho dados de TODAS as fontes (paralelizar quando possível)
2. Monto `data/snapshots/latest.json` com schema atualizado
3. Copio pra `data/snapshots/YYYY-MM-DD-HHMM.json` (timestamp evita colisão de mesmo dia)
4. `git add data/snapshots/*.json && git commit -m "data: snapshot YYYY-MM-DD HH:MM" && git push`
5. Vercel rebuilda (~60-90s)
6. Aviso Mauricio: link pro dashboard + resumo de mudanças vs snapshot anterior

## Comandos aliases

- "atualiza o dashboard" / "puxa dados" / "puxa tudo" / "atualiza" → roteiro completo
- "atualiza só [Google Ads | GA4 | GSC | LinkedIn]" → roteiro parcial, merge no JSON
- "compara com ontem" → diff entre 2 snapshots, mostra %∆ por métrica
