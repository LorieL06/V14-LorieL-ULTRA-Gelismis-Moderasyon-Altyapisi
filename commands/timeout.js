const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Kullanıcıya belirli bir süre için timeout uygular.')
        .addUserOption(option => option.setName('user').setDescription('Timeout uygulanacak kullanıcı').setRequired(true))
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Timeout süresi (saniye cinsinden)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(3600)), // Maksimum süreyi 1 saat (3600 saniye) olarak ayarlayın
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration'); // Timeout süresi (saniye cinsinden)

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return await interaction.reply('Bu komutu kullanmak için yeterli izne sahip değilsiniz.');
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);

            if (member.communicationDisabledUntilTimestamp) {
                return await interaction.reply('Bu kullanıcı zaten timeoutta.');
            }

            // Timeout uygulama
            await member.timeout(duration * 1000, `Timeout süresi: ${duration} saniye`);
            await interaction.reply(`Kullanıcı ${user.username} için ${duration} saniye süreyle timeout uygulandı.`);
        } catch (error) {
            console.error('Timeout uygulanırken bir hata oluştu:', error);
            await interaction.reply('Timeout uygulanırken bir hata oluştu.');
        }
    },
};
