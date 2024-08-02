const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.deferReply();
            }
            await command.execute(interaction, client);
            if (interaction.deferred) {
                await interaction.editReply({ content: 'Komut başarıyla çalıştırıldı!' });
            }
        } catch (error) {
            console.error('Komut çalıştırılırken bir hata oluştu:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
            } else if (interaction.deferred) {
                await interaction.editReply({ content: 'Bir hata oluştu!', ephemeral: true });
            }
        }
    },
};
