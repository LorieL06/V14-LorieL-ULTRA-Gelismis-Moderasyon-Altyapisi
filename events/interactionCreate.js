const { Events } = require('discord.js');
const { has } = require('../blacklist');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Komut çalıştırılırken bir hata oluştu:', error);
                await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu.', ephemeral: true });
            }
        }
    },
};
