const { DateTime } = require("luxon");
const { getScheduledMessages, setScheduledMessages } = require('../data/loaders');
const { DISCORD_CONFIG } = require('../config/constants');

let currentDate = null;

const getBuenosAiresDate = () => {
    return DateTime.now().setZone("America/Argentina/Buenos_Aires");
};

const isEventDueNow = (message, instanceIndex) => {
    let targetHours = message.instances[instanceIndex].startHour;
    let targetMinutes = message.instances[instanceIndex].startMinute - message.notificationGracePeriodInMinutes;
    
    if (targetMinutes < 0) {
        targetHours = message.instances[instanceIndex].startHour - 1;
        targetMinutes = 60 - Math.abs(targetMinutes);
    }

    return message.instances[instanceIndex].day.includes(currentDate.weekday) &&
           targetHours === currentDate.hour &&
           targetMinutes === currentDate.minute &&
           message.instances[instanceIndex].sent === false;
};

const sendEventMessage = async (client, message) => {
    try {
        const channel = client.guilds.cache.get(DISCORD_CONFIG.serverId)
            .channels.cache.get(DISCORD_CONFIG.eventsChannelId);
        
        const fileToSend = {
            attachment: `img/${message.image}`,
            name: message.image,
            description: message.image,
        };

        const contentToSend = createMessageForDueEvent(message);
        
        await channel.send({ files: [fileToSend], content: contentToSend });
    } catch (e) {
        console.log("ERROR : Failed to send event message:", e.message);
    }
};

const createMessageForDueEvent = (message) => {
    let messageToSend = `${DISCORD_CONFIG.eventsRoleId} `
    switch (message.type){
        case "Reputation":
            messageToSend += `${DISCORD_CONFIG.reputationRoleId} `
            break;
        case "Friendship":
            messageToSend += `${DISCORD_CONFIG.friendshipRoleId} `
            break;
        case "Guild":
            messageToSend += `${DISCORD_CONFIG.guildEventsRoleId} `
            break;
    }
    messageToSend += `${message.name} en ${message.notificationGracePeriodInMinutes} minutos`
    return messageToSend
}

const resetEventsSentFlag = () => {
    const messages = getScheduledMessages();
    const updatedMessages = messages.map(message => {
        let newMessage = { ...message };
        newMessage.instances = newMessage.instances.map(instance => {
            return { ...instance, sent: false };
        });
        return newMessage;
    });
    setScheduledMessages(updatedMessages);
};

const startEventScheduler = (client) => {
    setInterval(async () => {
        currentDate = getBuenosAiresDate();

        if (currentDate.hour === 23 && currentDate.minute === 30) {
            resetEventsSentFlag();
        }

        const scheduledMessages = getScheduledMessages();

        for (let i = 0; i < scheduledMessages.length; i++) {
            for (let j = 0; j < scheduledMessages[i].instances.length; j++) {
                const message = scheduledMessages[i];
                
                if (isEventDueNow(message, j)) {
                    await sendEventMessage(client, message);
                    scheduledMessages[i].instances[j].sent = true;
                }
            }
        }

        setScheduledMessages(scheduledMessages);
    }, 10000);
};

module.exports = {
    startEventScheduler,
    getBuenosAiresDate,
};
