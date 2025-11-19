const { getRoles } = require('../data/loaders');

const execute = async (message) => {
    const rolCommand = message.content.match(/^!rol\s+(add|remove)\s+([^\s]+)$/i);

    if (!rolCommand) {
        return message.reply('Formato incorrecto. Usa: `!rol [add/remove] [nombreDelRol]`');
    }

    const [_, action, roleName] = rolCommand;
    const allowedRoles = getRoles().roles;

    const allowedRole = allowedRoles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    if (!allowedRole) {
        return message.reply(`El rol ${roleName} no está permitido o no existe.`);
    }

    const targetUser = message.member;
    const botMember = message.guild.members.cache.get(message.client.user.id);
    const role = message.guild.roles.cache.get(allowedRole.id);

    if (!role) {
        return message.reply(`No se encontró el rol ${roleName} en el servidor.`);
    }

    if (botMember.roles.highest.position <= role.position) {
        return message.reply('No tengo permisos para gestionar este rol. Mi rol debe estar por encima del rol que intentas asignarte.');
    }

    try {
        const hasRole = targetUser.roles.cache.has(role.id);

        if (action.toLowerCase() === 'add') {
            if (hasRole) {
                return message.reply(`Ya tienes el rol ${role.name} asignado.`);
            }
            await targetUser.roles.add(role);
            return message.reply(`Se te ha asignado el rol ${role.name} correctamente.`);
        } else {
            if (!hasRole) {
                return message.reply(`No tienes el rol ${role.name} asignado.`);
            }
            await targetUser.roles.remove(role);
            return message.reply(`Se te ha quitado el rol ${role.name} correctamente.`);
        }
    } catch (error) {
        console.error('Error al gestionar roles:', error);
        message.reply('Ocurrió un error inesperado al gestionar los roles. Por favor, inténtalo de nuevo más tarde.');
    }
};

module.exports = {execute};
