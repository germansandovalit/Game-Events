const fs = require("fs");
const path = require("path");

let scheduledMessages = [];
let rolesData = [];

const loadMessages = () => {
    return new Promise((resolve, reject) => {
        const messagesPath = path.join(__dirname, 'messages.json');
        fs.readFile(messagesPath, 'utf8', (err, data) => {
            if (err) {
                console.log("ERROR : Error on reading file messages.json : " + err);
                scheduledMessages = [];
                reject(err);
            } else {
                try {
                    scheduledMessages = JSON.parse(data);
                    console.log("INFO : Scheduled messages imported from messages.json");
                    resolve(scheduledMessages);
                } catch (e) {
                    console.log("ERROR : Error parsing messages.json : " + e);
                    scheduledMessages = [];
                    reject(e);
                }
            }
        });
    });
};

const loadRoles = () => {
    return new Promise((resolve, reject) => {
        const rolesPath = path.join(__dirname, 'roles.json');
        fs.readFile(rolesPath, 'utf8', (err, data) => {
            if (err) {
                console.log("ERROR : Error on reading file roles.json : " + err);
                rolesData = [];
                reject(err);
            } else {
                try {
                    rolesData = JSON.parse(data);
                    console.log("INFO : Roles imported from roles.json");
                    resolve(rolesData);
                } catch (e) {
                    console.log("ERROR : Error parsing roles.json : " + e);
                    rolesData = [];
                    reject(e);
                }
            }
        });
    });
};

const getScheduledMessages = () => scheduledMessages;

const setScheduledMessages = (messages) => {
    scheduledMessages = messages;
};

const getRoles = () => rolesData;

module.exports = {
    loadMessages,
    loadRoles,
    getScheduledMessages,
    setScheduledMessages,
    getRoles,
};
