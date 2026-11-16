# St. Ann's Saints CYO Sports Management Platform

Web-based administration, roster, scheduling, uniform tracking, and family portal application for **St. Ann's Saints CYO Sports** (San Antonio, Texas), deployed on **Cloudflare Workers + KV** with a local staging workflow.

## Environments
- - **Production:** `https://stanns.opp-solutions.com/` (Cloudflare Workers + `CYO_STATE` KV namespace)
- **Local Staging:** `http://100.86.18.142:8090` (`oppelthome`)

## Key Features
- **Season & Division Management:** Multi-sport and multi-division administration.
- **Registrations & Bulk Editing:** $80 per-athlete registration fee and multi-select bulk status/payment updates.
- **Season Overview Balance Card:** Real-time Balance Due, Collected, and Total Season Billed at $80/athlete.
- **Non-Destructive Staging-to-Production Sync:** Live edits auto-sync to KV via `/api/live-merge`; staging publishes deep-merge without overwriting live work.

## Deployment
`npx wrangler deploy`
