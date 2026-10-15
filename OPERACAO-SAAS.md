# OPERACAO SAAS

## Nome oficial

- `Kairos CRM`
  - este repositorio e o fork do Kairos CRM
  - atendimento
  - inbox
  - agentes
  - WhatsApp
  - automacoes de conversa

## Regra principal

- `kairos-crm` (este repo) = `Kairos CRM`
- tudo abaixo vira `Kairos CRM`, nada de manter `Kairos CRM` / `NEXUS IA`

## Marca

- nome visivel em todo lugar: `Kairos CRM`
- logo: wordmark `Kairos CRM` (sem simbolo grafico)
- paleta: emerald-500 + slate-900 (igual ao resto da familia Kairos)

## Dominios

- Atendimento (Kairos CRM):
  - `chat.fbautomacao.space`

## Stack

- 100% VPS Dokploy (187.77.229.227)
- Postgres + pgvector: `kairos-shared-pg` (database `kairos-crm_db`)
- Redis: container proprio no Dokploy
- App Rails + Sidekiq: container proprio
- Caddy reverse proxy com wildcard SSL ja existente

## Repositorio

- Atendimento: `https://github.com/appfbj-stack/chatwoot`

## Funcao deste repositorio

Este repositorio deve manter:

- stack docker do fork Kairos CRM rebrandado pra Kairos CRM
- wordmark `Kairos CRM` em todos os assets
- overrides do Super Admin
- `.env.example` do atendimento
- deploy do atendimento

## Nome que deve lembrar

- `Kairos CRM` (era `NEXUS IA Atendimento`)
- descartar `NEXUS IA` deste repo
