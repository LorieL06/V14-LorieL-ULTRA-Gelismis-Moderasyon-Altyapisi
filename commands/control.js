const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { exec } = require('child_process');
const process = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('Bot kontrol komutları.')
        .addSubcommand(subcommand => 
            subcommand
                .setName('restart')
                .setDescription('Botu yeniden başlatır.'))
        .addSubcommand(subcommand => 
            subcommand
                .setName('shutdown')
                .setDescription('Botu kapatır.')),
    async execute(interaction) {
        const ownerId = process.env.OWNER_ID; // Bot sahibinin ID'sini .env dosyasından al

        if (interaction.user.id !== ownerId) {
            return await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'restart') {
            await interaction.reply('Bot yeniden başlatılıyor...');
            exec('pm2 restart bot', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Hata: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        } else if (subcommand === 'shutdown') {
            await interaction.reply('Bot kapatılıyor...');
            exec('pm2 stop bot', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Hata: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            process.exit();
        }
    },
};
