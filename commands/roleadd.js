const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolver')
        .setDescription('Belirtilen kullanıcıya rol ekler.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Rol verilecek kullanıcı')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Eklemek için rol')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply({ content: 'Bu komutu kullanma izniniz yok.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('target');
        const role = interaction.options.getRole('role');

        const member = interaction.guild.members.resolve(targetUser.id);

        if (!member) {
            return interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', ephemeral: true });
        }

        try {
            await member.roles.add(role);
            await interaction.reply({ content: `${targetUser.tag} kullanıcısına ${role.name} rolü başarıyla eklendi.`, ephemeral: true });
        } catch (error) {
            console.error('Rol ekleme sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Rol eklenirken bir hata oluştu.', ephemeral: true });
        }
    },
};
