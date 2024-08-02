const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolal')
        .setDescription('Belirtilen kullanıcıdan rol alır.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Rol alınacak kullanıcı')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Alınacak rol')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const role = interaction.options.getRole('role');

        // Bot sahibinin ID'sini kontrol et
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply({ content: 'Bu komutu kullanma izniniz yok.', ephemeral: true });
        }

        const member = interaction.guild.members.resolve(targetUser.id);

        if (!member) {
            return interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', ephemeral: true });
        }

        try {
            await member.roles.remove(role);
            await interaction.reply({ content: `${targetUser.tag} kullanıcısından ${role.name} rolü başarıyla alındı.`, ephemeral: true });
        } catch (error) {
            console.error('Rol alma sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Rol alınırken bir hata oluştu.', ephemeral: true });
        }
    },
};
