# CLAUDE.md — alc-homes-checkin-web

## Qué es este proyecto
Frontend del self check-in para huéspedes de **dos propiedades**: el hostal ALC Homes San Blas y La Casa de la Primavera (Gran Alacant, añadida agosto/septiembre 2026). Es la parte visible que ve el huésped tras reservar.

## Repos relacionados (organización alchomes2025-afk)
- Este repo: `alc-homes-checkin-web` — Firebase Hosting: https://alc-homes-checkin.web.app
- Backend: `hostal-pdf-extractor` (Render) — https://hostal-pdf-extractor.onrender.com
- Historial/admin: `alc-homes-historial-web`

## Flujo
Booking.com/otros canales → Beds24 (ALC Homes San Blas: property 339751, room IDs 702395–702399; La Casa de la Primavera: property 349341, room 720841) → RPV (registroparteviajeros.com, dos cuentas separadas) → backend Render → **este frontend** → notificación WhatsApp vía CallMeBot al completarse.

## Comportamiento clave del frontend
- Multilenguaje: ES/EN/FR/DE/VAL — cualquier cambio de textos debe replicarse en los 5 idiomas.
- Solo revela habitación y PIN cuando el estado de la reserva es "staying" (huésped ya alojado) — nunca antes, es una medida de seguridad intencionada, no un bug.
- Autopoll cada 45 segundos mientras el estado es "pre_checkin", para detectar cuándo el huésped completa el proceso.
- Usa `todayISOMadrid()` para fecha/hora — **no** usar `toISOString()` directamente, ya causó bugs de fecha equivocada por zona horaria.
- La fecha de llegada se resuelve en JavaScript en el cliente antes de inyectarla en la UI, no se calcula en el backend.
- Desplegado en Firebase Hosting (no Vercel) específicamente porque Booking.com filtra/valida el dominio de la URL de check-in — no migrar de hosting sin verificar que sigue pasando ese filtro.
- **Multi-propiedad** (septiembre 2026): cuando `booking.room_id === '720841'` (La Casa de la Primavera), `welcomeCard()` (los 5 idiomas) y `buildSystemPrompt()`/`FAQ_DOCUMENT_CASA_PRIMAVERA` usan textos y datos propios de esa vivienda (dirección Avenida Carabassí 1 Gran Alacant, código de urbanización 2308, cajetín de llaves, WiFi `MIWIFI_tThy`) — **nunca** mezclar con los del hostal (Camino de Ronda, código de portal 130773, WiFi ALCHOMES). Falta aún incorporar el enlace de RPV de esta propiedad (`RPV_LINKS["720841"]` en el backend, todavía pendiente).

## Estilo de trabajo de Adrián
- Sin entorno local hasta ahora — viene de trabajar 100% desde GitHub web UI, commits directos a `main` con auto-deploy. Verificar en local con Claude Code antes de hacer push.
- Este frontend lo usan huéspedes reales en tiempo real — avisar y confirmar explícitamente antes de cualquier cambio que afecte el flujo de check-in en producción.
