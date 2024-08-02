const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıtsız')
        .setDescription('Kullanıcının tüm rollerini alır ve sadece kayıtsız rolü verir.')
        .addUserOption(option => option.setName('user').setDescription('Rolü alınacak kullanıcı').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);

        // Kayıtsız rolünün ID'sini buraya ekleyin
        const kayitsizRoleId = '1256620392697692200'; // 

        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return await interaction.reply('Bu komutu kullanmak için yeterli izinlere sahip değilsiniz.');
        }

        try {
            
            const roles = member.roles.cache.map(role => role.id);
            await member.roles.remove(roles);

            await member.roles.add(kayitsizRoleId);

            await interaction.reply(`Kullanıcı ${user.username} rolü kaldırıldı ve sadece kayıtsız rolü verildi.`);
        } catch (error) {
            console.error('Kayıtsız rolü verirken bir hata oluştu:', error);
            await interaction.reply('Kayıtsız rolü verirken bir hata oluştu.');
        }
    },
};
