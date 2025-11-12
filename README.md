# Discord Event Scheduler Bot

Bot de Discord que anuncia automáticamente eventos programados según el horario de Buenos Aires y permite consultar los eventos del día con un simple comando.

---

## 🚀 Características
- Envía notificaciones automáticas de eventos según el horario configurado.  
- Menciona roles específicos dependiendo del tipo de evento.  
- Comando `!eventos` para listar los eventos del día.  
- Registra errores en `errors.log`.  
- Carga los eventos desde `messages.json`.

---

## ⚙️ Requisitos
- Node.js 18+  
- Archivo `.env` con las siguientes variables:

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_SERVER_ID=your_server_id
DISCORD_EVENTS_CHANNEL_ID=channel_id
DISCORD_EVENTS_ROLE_ID=@Eventos
DISCORD_FRIENDSHIP_ROLE_ID=@Friendship Points
DISCORD_REPUTATION_ROLE_ID=@Asteria Reputation
DISCORD_GUILD_EVENTS_ROLE_ID=@Guild Events
