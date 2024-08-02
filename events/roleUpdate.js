const { Events } = require('discord.js');
const { loadWhitelist } = require('../whitelist'); 

const whitelist = loadWhitelist();

module.exports = {
    name: Events.RoleUpdate,
    async execute(oldRole, newRole) {
        if (oldRole.name === newRole.name) return;

        const guild = oldRole.guild;

        if (!whitelist.has(oldRole.client.user.id)) {
            try {
                await newRole.edit({ name: oldRole.name });
                
                const user = guild.members.cache.get(oldRole.client.user.id);
                if (user) {
                    await user.ban({ reason: 'Whitelist koruma nedeniyle banlandı.' });
                }

                console.log(`Rol değiştirildi ve ${user.tag} banlandı.`);
            } catch (error) {
                console.error('Rol geri alınırken bir hata oluştu:', error);
            }
        }
    },
};
