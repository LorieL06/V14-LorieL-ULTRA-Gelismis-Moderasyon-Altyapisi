const { Events } = require('discord.js');
const { has } = require('../blacklist');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (has(member.id)) {
            try {
                await member.ban({ reason: 'Blacklist nedeniyle banlandı.' });
            } catch (error) {
                console.error('Kullanıcı banlanırken bir hata oluştu:', error);
            }
        }
    },
};
