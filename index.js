require("dotenv").config();
const { Client, GatewayIntentBits, Attachment } = require("discord.js");
const { DateTime } = require("luxon");
const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const serverId = process.env.DISCORD_SERVER_ID;
const eventsChannelId = process.env.DISCORD_EVENTS_CHANNEL_ID;
const eventsRoleId = process.env.DISCORD_EVENTS_ROLE_ID
const friendshipRoleId = process.env.DISCORD_FRIENDSHIP_ROLE_ID
const reputationRoleId = process.env.DISCORD_REPUTATION_ROLE_ID
const guildEventsRoleId = process.env.DISCORD_GUILD_EVENTS_ROLE_ID

const getBuenosAiresDate = () => {
    return DateTime.now().setZone("America/Argentina/Buenos_Aires");
};

let date = null;

const weekday = [
    "",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
];

let scheduledMessages = new Array();

client.once("ready", () => {
    console.log("INFO : Bot started");
	fs.readFile('./messages.json', 'utf8', function(err, data){
    	if(err) {
			console.log("ERROR : Error on reading file messages.json : " + err);
		}
		else {
			try {
				scheduledMessages = JSON.parse(data);
				console.log("INFO : Scheduled messages imported from messages.json");
			}
			catch(e) {
				scheduledMessages = new Array();
			}
		}
	});
    console.log(`Bot is online as ${client.user.tag}`);

    /*
    const channel = client.guilds.cache.get(serverId).channels.cache.get(eventsChannelId);
    const messageToSend = {
        attachment: `img/bebida.jpg`,
        name: `bebida.jpg`,
        description: `test`,
    }
    channel.send({files: [messageToSend], content: `test message`})
    */

});

const isEventDueNow = message => {
    let targetHours = message.startHour;
    let targetMinutes = message.startMinute - message.notificationGracePeriodInMinutes
    if (targetMinutes < 0){
        targetHours = message.startHour - 1;
        targetMinutes = 60 - Math.abs(targetMinutes);
    }

    /*
    console.log("--------------")
    console.log(`event.name ${message.name}`)
    console.log(`is event day: ${message.day.includes(date.weekday)}`)
    console.log(`targetHours: ${targetHours}`)
    console.log(`targetMinutes: ${targetMinutes}`)
    console.log(`message.sent ${message.sent}`)
    */
    return message.day.includes(date.weekday) &&
           targetHours == date.hour && 
           targetMinutes == date.minute && 
           message.sent == false
}

setInterval(function() {
    date = getBuenosAiresDate();

    if (date.hour == 23 && date.minute == 30){
        scheduledMessages = scheduledMessages.map(message => {
            return {...message, sent: false}
        })
    }

	for(var i = 0; i < scheduledMessages.length; i++) {
        let message = scheduledMessages[i];
		if(isEventDueNow(message)) {
			try {
                const channel = client.guilds.cache.get(serverId).channels.cache.get(eventsChannelId);
                const fileToSend = {
                    attachment: `img/${message.image}`,
                    name: message.image,
                    description: message.image,
                }
                let contentToSend = createMessageForDueEvent(message)
                channel.send({files: [fileToSend], content: contentToSend})
                scheduledMessages[i] = {...message, sent: true}
			}
			catch(e) {
                console.log(e.message)
			}
		}
	}
}, 10000);


const createMessageForDueEvent = (message) => {
    let messageToSend = `${eventsRoleId} `
    switch (message.type){
        case "Reputation":
            messageToSend += `${reputationRoleId} `
            break;
        case "Friendship":
            messageToSend += `${friendshipRoleId} `
            break;
        case "Guild":
            messageToSend += `${guildEventsRoleId} `
            break;
    }
    messageToSend += `${message.name} en ${message.notificationGracePeriodInMinutes} minutos`
    return messageToSend
}

function logToFile(message) {
    fs.appendFileSync("errors.log", message + "\n");
}

process.on("uncaughtException", (err) => {
    logToFile(`[UncaughtException] ${new Date().toISOString()} → ${err.stack}`);
  });
  
process.on("unhandledRejection", (reason) => {
    logToFile(`[UnhandledRejection] ${new Date().toISOString()} → ${reason}`);
});

client.on("messageCreate", (message) => {
    date = getBuenosAiresDate();
    const fullMessage = message.content.toLowerCase();
    if (fullMessage == "!eventos") {
        let weekDay = date.weekday;
        messageReply = `Eventos ${weekday[weekDay]} \n`;
        let filteredEvents = scheduledMessages.filter((event) =>
            event.day.includes(Number(weekDay))
        );
        filteredEvents.sort((a, b) => a.startHour - b.startHour);
        for (let event of filteredEvents) {
            const message = getMessage(event);
            messageReply += message + "\n";
        }
        message.reply(messageReply);
    }
});

client.login(process.env.DISCORD_TOKEN);

const getMessage = (event) => {
    let message = "";
    const eventStartTime = date.set({
        hours: event.startHour,
        minutes: event.startMinute,
    });
    const eventStartTimeUnixTime = Math.floor(eventStartTime.toSeconds());
    message += `${event.name} <t:${eventStartTimeUnixTime}:t> (<t:${eventStartTimeUnixTime}:R>)`;

    if (event.durationHours != undefined) {
        const eventEndTime = eventStartTime.plus({
            hours: event.durationHours,
        });
        const eventEndTimeUnixTime = Math.floor(eventEndTime.toSeconds());
        message += ` - Finaliza <t:${eventEndTimeUnixTime}:t> (<t:${eventEndTimeUnixTime}:R>)`;
    }

    return message;
};
