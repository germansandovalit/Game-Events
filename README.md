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
```

## 🗺️ Roadmap / Próximas Funcionalidades

### 🧩 Mejoras Planeadas
- [ ] Actualizar el comando `!eventos` para **agrupar los eventos por nombre**.  
- [ ] Actualizar el comando `!eventos` para mostrar una **tabla resumida** con las siguientes columnas:  
  | Nombre de Evento | Recompensa | Próximo Evento |
  |------------------|-------------|----------------|
  | *Ejemplo:* Street Theater | Friendship Points | <t:1731452400:R> (<t:1731452400:t>) |
- [ ] Permitir que los usuarios puedan **agregar o quitar roles** mediante comandos del bot.  
  Roles disponibles:  
  - @Eventos  
  - @Guild Events  
  - @Asteria Reputation  
  - @Friendship Points  
- [ ] Modificar la estructura de `messages.json` para **agrupar los eventos por nombre**, almacenando dentro de cada uno una lista de instancias.  
  Ejemplo propuesto:
  ```json
  {
    "Street Theater": {
      "type": "Friendship",
      "instances": [
        { "day": [2,4,6,7], "startHour": 14, "startMinute": 0, "durationHours": 1, "notificationGracePeriodInMinutes": 5, "image": "streettheater.png" },
        { "day": [1,3], "startHour": 20, "startMinute": 30, "durationHours": 1, "notificationGracePeriodInMinutes": 5, "image": "streettheater.png" }
      ]
    }
  }
```


