const { EmbedBuilder } = require('discord.js');
const { getScheduledMessages } = require('../data/loaders');
const { getBuenosAiresDate } = require('../handlers/eventScheduler');
const { WEEKDAYS } = require('../config/constants');

const getFilteredEvents = (events, weekDay) => {
    const now = getBuenosAiresDate();
    const currentTime = now.hour * 60 + now.minute;
    let filteredEvents = [];

    filteredEvents = events.flatMap(event => {
        const nextInstance = event.instances
            .filter(instance => instance.day.includes(Number(weekDay)))
            .map(instance => ({
                ...instance,
                totalMinutes: instance.startHour * 60 + instance.startMinute
            }))
            .sort((a, b) => a.totalMinutes - b.totalMinutes)
            .find(instance => instance.totalMinutes >= currentTime);

        if (nextInstance) {
            return [{
                ...event,
                day: [weekDay],
                startHour: nextInstance.startHour,
                startMinute: nextInstance.startMinute
            }];
        }
        return [];
    });

    filteredEvents.sort((a, b) => (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute));
    return filteredEvents;
};

const getTimeInfo = (event) => {
    const now = getBuenosAiresDate();
    let info = "";
    const eventStartTime = now.set({
        hours: event.startHour,
        minutes: event.startMinute,
    });
    const eventStartTimeUnixTime = Math.floor(eventStartTime.toSeconds());
    info += `<t:${eventStartTimeUnixTime}:t> (<t:${eventStartTimeUnixTime}:R>)`;

    if (event.durationHours !== undefined) {
        const eventEndTime = eventStartTime.plus({
            hours: event.durationHours,
        });
        const eventEndTimeUnixTime = Math.floor(eventEndTime.toSeconds());
        info += ` / <t:${eventEndTimeUnixTime}:t> (<t:${eventEndTimeUnixTime}:R>)`;
    }

    return info;
};

const getEventEmbed = (events, weekDay) => {
    const WIDE_SPACE = '\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800';
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setFooter({
            text: WIDE_SPACE,
        })
        .setTitle(`Eventos del día - ${WEEKDAYS[weekDay]} ${WIDE_SPACE}`);

    if (events.length === 0) {
        embed.setDescription('No hay eventos programados para hoy.');
    } else {
        embed.addFields({
            name: 'Evento',
            value: events.map(e => `• ${e.name}`).join('\n'),
            inline: true
        });
        embed.addFields({
            name: "Proximo Evento",
            value: events.map(event => getTimeInfo(event)).join('\n'),
            inline: true
        });
    }

    return embed;
};

const execute = async (message) => {
    try {
        const now = getBuenosAiresDate();
        let weekDay = now.weekday;
        const scheduledMessages = getScheduledMessages();
        let filteredEvents = getFilteredEvents(scheduledMessages, weekDay);
        const embed = getEventEmbed(filteredEvents, weekDay);
        await message.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in eventos command:', error);
        message.reply('Ocurrió un error al obtener los eventos.');
    }
};

module.exports = {execute};
