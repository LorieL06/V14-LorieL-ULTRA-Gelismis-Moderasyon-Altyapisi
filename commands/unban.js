const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Bir kullanıcıyı yasaktan çıkarır.')
        .addStringOption(option => 
            option.setName('user_id')
                .setDescription('Yasaklanan kullanıcının ID\'si')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.options.getString('user_id');

        try {
            const guild = interaction.guild;

            await guild.bans.remove(userId);

            await interaction.reply(`Kullanıcı ${userId} başarıyla yasaktan çıkarıldı.`);
        } catch (error) {
            console.error('Unban işlemi sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Bir hata oluştu, kullanıcı yasaktan çıkarılamadı.', ephemeral: true });
        }
    },
};
