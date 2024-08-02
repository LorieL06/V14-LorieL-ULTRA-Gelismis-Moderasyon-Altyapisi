const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const clientId = process.env.CLIENT_ID;
const token = process.env.BOT_TOKEN;

const loadCommands = async () => {
    const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands')).filter(file => file.endsWith('.js'));
    const slashCommands = [];

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, '..', 'commands', file));
        if (command.data) {
            slashCommands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('Komutlar yükleniyor...');
        await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
        console.log('Komutlar başarıyla yüklendi!');
    } catch (error) {
        console.error('Komutlar yüklenirken bir hata oluştu:', error);
    }
};

loadCommands();
