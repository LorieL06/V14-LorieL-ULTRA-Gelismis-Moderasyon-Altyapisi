const { Events } = require('discord.js');
const { loadWhitelist } = require('../whitelist'); // Whitelist fonksiyonlarını import et

const whitelist = loadWhitelist();

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        // Eğer kanalın eski ve yeni hali aynıysa, yani değişiklik yoksa, işlemi yapma
        if (oldChannel.name === newChannel.name) return;

        const guild = oldChannel.guild;

        // Eğer kanalı değiştiren kişi whitelist'te değilse
        if (!whitelist.has(oldChannel.client.user.id)) {
            try {
                // Kanalın eski halini geri getir
                await newChannel.edit({ name: oldChannel.name });
                
                // Kanalı değiştiren kişiyi banla
                const user = guild.members.cache.get(oldChannel.client.user.id);
                if (user) {
                    await user.ban({ reason: 'Whitelist koruma nedeniyle banlandı.' });
                }

                console.log(`Kanal değiştirildi ve ${user.tag} banlandı.`);
            } catch (error) {
                console.error('Kanal geri alınırken bir hata oluştu:', error);
            }
        }
    },
};
