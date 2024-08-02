const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Belirtilen kullanıcıyı sunucudan atar.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Atılacak kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Atılma nedeni')),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'Neden belirtilmemiş';

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli izniniz yok.', ephemeral: true });
        }

        const targetMember = interaction.guild.members.resolve(targetUser.id);

        if (!targetMember) {
            return interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', ephemeral: true });
        }

        try {
            await targetMember.kick(reason);
            await interaction.reply({ content: `${targetUser.tag} başarıyla atıldı.`, ephemeral: true });
        } catch (error) {
            console.error('Atma sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Kullanıcı atılırken bir hata oluştu.', ephemeral: true });
        }
    },
};
