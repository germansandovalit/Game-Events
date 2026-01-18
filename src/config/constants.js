require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const DISCORD_CONFIG = {
    serverId: process.env.DISCORD_SERVER_ID,
    eventsChannelId: process.env.DISCORD_EVENTS_CHANNEL_ID,
    eventsRoleId: process.env.DISCORD_EVENTS_ROLE_ID,
    friendshipRoleId: process.env.DISCORD_FRIENDSHIP_ROLE_ID,
    reputationRoleId: process.env.DISCORD_REPUTATION_ROLE_ID,
    guildEventsRoleId: process.env.DISCORD_GUILD_EVENTS_ROLE_ID,
    discordSignInEventRoleId: process.env.DISCORD_SIGN_IN_EVENT_ROLE_ID
};

const WEEKDAYS = [
    "",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
];

module.exports = {
    client,
    DISCORD_CONFIG,
    WEEKDAYS,
};
