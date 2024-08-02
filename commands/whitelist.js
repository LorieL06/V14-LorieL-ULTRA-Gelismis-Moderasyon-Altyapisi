const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const WHITELIST_FILE = path.join(__dirname, '..', 'whitelist.json'); 

const loadWhitelist = () => {
    try {
        if (!fs.existsSync(WHITELIST_FILE)) {
            fs.writeFileSync(WHITELIST_FILE, JSON.stringify([]), 'utf-8');
        }
        const data = fs.readFileSync(WHITELIST_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Whitelist yüklenirken bir hata oluştu:', error);
        return [];
    }
};

const saveWhitelist = (whitelist) => {
    try {
        fs.writeFileSync(WHITELIST_FILE, JSON.stringify(whitelist, null, 2), 'utf-8');
    } catch (error) {
        console.error('Whitelist kaydedilirken bir hata oluştu:', error);
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Whitelist sistemini yönetir')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Kullanıcıyı whitelist\'e ekler')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('Whitelist\'e eklenecek kullanıcı')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Kullanıcıyı whitelist\'ten çıkarır')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Whitelist\'ten çıkarılacak kullanıcı')
                        .setRequired(true))),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const whitelist = loadWhitelist();
        const userId = user.id;
        const isOwner = interaction.user.id === process.env.OWNER_ID;

        if (!isOwner) {
            return interaction.editReply({ content: 'Bu komutu sadece bot sahibi kullanabilir.' });
        }

        if (subcommand === 'add') {
            if (!whitelist.includes(userId)) {
                whitelist.push(userId);
                saveWhitelist(whitelist);
                try {
                    await user.send('Whitelist\'e alındınız.');
                } catch (error) {
                    console.error('Özel mesaj gönderilirken bir hata oluştu:', error);
                }
                await interaction.editReply({ content: `${user.tag} whitelist'e eklendi.` });
            } else {
                await interaction.editReply({ content: `${user.tag} zaten whitelist'te.` });
            }
        } else if (subcommand === 'remove') {
            const index = whitelist.indexOf(userId);
            if (index !== -1) {
                whitelist.splice(index, 1);
                saveWhitelist(whitelist);
                try {
                    await user.send('Whitelist\'ten çıkarıldınız.');
                } catch (error) {
                    console.error('Özel mesaj gönderilirken bir hata oluştu:', error);
                }
                await interaction.editReply({ content: `${user.tag} whitelist'ten çıkarıldı.` });
            } else {
                await interaction.editReply({ content: `${user.tag} whitelist'te değil.` });
            }
        }
    },
};
