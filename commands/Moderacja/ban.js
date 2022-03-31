const { MessageEmbed } = require("discord.js")
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "Ban",
    aliases: ["ban"],
    description: "Zbanuje użytkownika",
    usage: "!Ban [Użytkownik] <powód>",
    run: async(client, message, args) => {


        if(message.deleteable) message.delete();

        if(!message.member.hasPermission("BAN_MEMBERS")){
            return message.channel.send("Nie masz wystarczających permisji!")
        };

        if(!args[0]){
            return message.channel.send("Musisz wskazać osobę którą chcesz zbanować!");
        };

        let reason;

        if(!args[1]){
            reason = "Brak powodu";
        }else {
            reason = args.slice(1).join(" ");
        }

        const doBana = message.mentions.members.first();


        if(!doBana.bannable){
            return message.channel.send("Sprawdź czy mam uprawnienia do tego! Jeżeli mam sprawdź kolejność rang.");
        }

        if(!doBana){
            return message.channel.send("Nie byłem w stanie odnaleźć użytkownika, spróbuj ponownie!");
        }

        if(doBana.id === message.author.id){
            return message.channel.send("Nie możesz sam siebie zbanować!");
        };

        const embed = new MessageEmbed()
        embed.setColor("RED")
        embed.setThumbnail(doBana.user.displayAvatarURL())
        embed.setTitle(`${doBana.user.username} został zbanowany!`)
        embed.setDescription(`Osoba zbanowana: ${doBana} (${doBana.user.tag})
        Zbanowany przez: ${message.author.username} (${message.author.tag})
        Powód: ${reason}`)
        embed.setFooter(doBana.id, doBana.user.displayAvatarURL())
        embed.setTimestamp();


        const promptEmbed = new MessageEmbed()
        promptEmbed.setColor("BLUE")
        promptEmbed.setAuthor(`Po 30 sekundach zniknie możliwość potwierdzenia.`)
        promptEmbed.setDescription(`Czy na pewno chcesz zbanować ${doBana}?`);

        await message.channel.send(promptEmbed).then(async msg => {
            const emotka = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if(emotka === "✅"){
                msg.delete();

                doBana.ban({reason: reason})
                .catch(err => {
                    if(err) return message.channel.send(`Napotkałem problem...`).then(console.log(err))
                });

                message.channel.send(embed)
            }else if (emotka === "❌"){
                msg.delete();

                message.channel.send("Ban anulowany!");
            };

        })





    }
};