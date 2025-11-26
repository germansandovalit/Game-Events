require("dotenv").config();
const { client } = require('./src/config/constants');
const { setupErrorHandlers } = require('./src/handlers/errorHandler');
const { setupMessageHandler } = require('./src/handlers/messageHandler');
const { startEventScheduler } = require('./src/handlers/eventScheduler');
const { loadMessages, loadRoles } = require('./src/data/loaders');

setupErrorHandlers();

client.once("ready", async () => {
    console.log("INFO : Bot started");
    
    try {
        await loadMessages();
        await loadRoles();
    } catch (err) {
        console.error("ERROR : Failed to load data on bot startup", err);
    }

    console.log(`Bot is online as ${client.user.tag}`);
});

client.on("messageCreate", setupMessageHandler);

startEventScheduler(client);

client.login(process.env.DISCORD_TOKEN);
