const { Events } = require('discord.js');

module.exports = {
    name: Events.GUILD_MEMBER_REMOVE,
    async execute(member) {
        const farewellChannel = member.guild.channels.cache.find(channel => channel.name === 'farewell');
        if (!farewellChannel) return;

        await farewellChannel.send(`${member.user.tag} ayrıldı. Üzgünüz, seni kaybettik.`);
    },
};
