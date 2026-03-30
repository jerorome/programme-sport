# OpenClaw — Agent IA Personnel

**Status:** 🔧 En cours
**Hébergement:** La tour (desktop tower, toujours allumée)
**NOT** sur le Raspberry Pi

## Stack
Python 3.11 + Claude API (Anthropic) + python-telegram-bot

## Architecture
- Bot Telegram comme interface
- Mémoire persistante : SOUL.md, IDENTITY.md, USER.md
- Service systemd pour fonctionnement 24/7
- Conversation history in-memory

## Coût estimé
- Haiku : ~3-7 EUR/mois
- Sonnet : ~10-20 EUR/mois
- Mix recommandé : ~5-10 EUR/mois

## Guide d'installation
Disponible dans la page Notion OpenClaw (9 étapes complètes) :
1. Créer bot via BotFather
2. Clé API Anthropic
3. Environnement Python 3.11+ venv
4. Configurer .env
5. Code bot.py complet
6. Tester
7. Service systemd
8. Maintenance
9. Docker optionnel

## Outils connectés (prévus)
Nextcloud, Google Calendar, Notion, FreshRSS, Email IMAP, Vikunja, YouTube API, TikTok API
