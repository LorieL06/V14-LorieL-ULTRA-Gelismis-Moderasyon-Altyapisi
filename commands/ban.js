const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Kullanıcıyı yasaklar')
        .addUserOption(option => option.setName('user').setDescription('Yasaklanacak kullanıcı').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Yasaklama sebebi').setRequired(false)), 
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi'; 
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return await interaction.reply('Bu komutu kullanmak için yeterli izinlere sahip değilsiniz.');
        }
        
        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.ban({ reason: reason });

            // Özel mesaj gönderme istersen sil
            try {
                await user.send(`Sunucudan yasaklandınız. Yasaklanma sebebi: ${reason}`);
            } catch (error) {
                console.error('Kullanıcıya özel mesaj gönderilirken bir hata oluştu:', error);
            }

            await interaction.reply(`Kullanıcı ${user.username} başarıyla yasaklandı. Sebep: ${reason}`);
        } catch (error) {
            console.error('Yasaklama sırasında bir hata oluştu:', error);
            await interaction.reply('Kullanıcıyı yasaklama sırasında bir hata oluştu.');
        }
    },
};
