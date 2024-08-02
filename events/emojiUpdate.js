const { Events } = require('discord.js');
const { loadWhitelist } = require('../whitelist'); // Whitelist fonksiyonlarını import et

const whitelist = loadWhitelist();

module.exports = {
    name: Events.GuildEmojiUpdate,
    async execute(oldEmoji, newEmoji) {
        if (oldEmoji.name === newEmoji.name) return;

        const guild = oldEmoji.guild;

        if (!whitelist.has(oldEmoji.client.user.id)) {
            try {
                await oldEmoji.edit({ name: oldEmoji.name });
                
                const user = guild.members.cache.get(oldEmoji.client.user.id);
                if (user) {
                    await user.ban({ reason: 'Whitelist koruma nedeniyle banlandı.' });
                }

                console.log(`Emoji değiştirildi ve ${user.tag} banlandı.`);
            } catch (error) {
                console.error('Emoji geri alınırken bir hata oluştu:', error);
            }
        }
    },
};
