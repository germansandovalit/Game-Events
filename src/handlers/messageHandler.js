const eventosCommand = require('../commands/eventos');
const rolCommand = require('../commands/rol');
const helpCommand = require('../commands/help');

const setupMessageHandler = async (message) => {
    const fullMessage = message.content.toLowerCase();

    if (message.author.bot) return;

    if (fullMessage === "!eventos") {
        await eventosCommand.execute(message);
        return;
    }

    if (fullMessage.startsWith('!rol')) {
        await rolCommand.execute(message);
        return;
    }
    
    if (fullMessage == "!a"){
        await helpCommand.execute(message)
    }
};

module.exports = {setupMessageHandler};
