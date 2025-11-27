const execute = async message => {
    return message.reply("!a - los comandos disponibles" + "\n" +
                         "!eventos - muestra los eventos del dia de hoy" + "\n" +
                         "!rol [add/remove] [Eventos|Friendship|Guild|Reputation]" + "\n"  
    )
}

module.exports = {execute};