const { Events } = require('discord.js');
const { has } = require('../blacklist');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        if (has(message.author.id)) {
            try {
                await message.author.send('Üzgünüz, siz blacklist\'te olduğunuz için bu sunucuda mesaj gönderemezsiniz.');
            } catch (error) {
                console.error('Mesaj gönderilirken bir hata oluştu:', error);
            }
            await message.delete();
            await message.guild.members.ban(message.author.id, { reason: 'Blacklist nedeniyle banlandı.' });
        }
    },
};
