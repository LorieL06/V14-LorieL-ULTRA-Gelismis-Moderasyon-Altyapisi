const { SlashCommandBuilder } = require('discord.js');
const { add, remove, has } = require('../blacklist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blackliste kullanıcı ekler veya çıkarır.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Blackliste kullanıcı ekler.')
                .addUserOption(option => option.setName('user').setDescription('Eklenecek kullanıcı').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Blacklistedan kullanıcı çıkarır.')
                .addUserOption(option => option.setName('user').setDescription('Çıkarılacak kullanıcı').setRequired(true))),
    
    async execute(interaction) {
        const ownerId = process.env.OWNER_ID; // Bot sahibi ID
        if (interaction.user.id !== ownerId) {
            await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', ephemeral: true });
            return;
        }

        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');

        if (subcommand === 'add') {
            add(user.id);
            await interaction.reply({ content: `${user.tag} blackliste eklendi.`, ephemeral: true });
        } else if (subcommand === 'remove') {
            remove(user.id);
            await interaction.reply({ content: `${user.tag} blacklistedan çıkarıldı.`, ephemeral: true });
        }
    }
};
