# CLAUDE.md — alc-homes-checkin-web

## Qué es este proyecto
Frontend del self check-in para huéspedes del hostal ALC Homes San Blas. Es la parte visible que ve el huésped tras reservar por Booking.com.

## Repos relacionados (organización alchomes2025-afk)
- Este repo: `alc-homes-checkin-web` — Firebase Hosting: https://alc-homes-checkin.web.app
- Backend: API pública del hostal (Render) — consultar con Adrián el nombre exacto del repo backend antes de asumir endpoints
- Historial/admin: `alc-homes-historial-web`

## Flujo
Booking.com → Beds24 (property ID 339751) → RPV (registroparteviajeros.com, room IDs 702395–702399) → backend Render → **este frontend** → notificación WhatsApp vía CallMeBot al completarse.

## Comportamiento clave del frontend
- Multilenguaje: ES/EN/FR/DE/VAL — cualquier cambio de textos debe replicarse en los 5 idiomas.
- Solo revela habitación y PIN cuando el estado de la reserva es "staying" (huésped ya alojado) — nunca antes, es una medida de seguridad intencionada, no un bug.
- Autopoll cada 45 segundos mientras el estado es "pre_checkin", para detectar cuándo el huésped completa el proceso.
- Usa `todayISOMadrid()` para fecha/hora — **no** usar `toISOString()` directamente, ya causó bugs de fecha equivocada por zona horaria.
- La fecha de llegada se resuelve en JavaScript en el cliente antes de inyectarla en la UI, no se calcula en el backend.
- Desplegado en Firebase Hosting (no Vercel) específicamente porque Booking.com filtra/valida el dominio de la URL de check-in — no migrar de hosting sin verificar que sigue pasando ese filtro.

## Estilo de trabajo de Adrián
- Sin entorno local hasta ahora — viene de trabajar 100% desde GitHub web UI, commits directos a `main` con auto-deploy. Verificar en local con Claude Code antes de hacer push.
- Este frontend lo usan huéspedes reales en tiempo real — avisar y confirmar explícitamente antes de cualquier cambio que afecte el flujo de check-in en producción.
