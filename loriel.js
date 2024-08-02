const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const { loadWhitelist } = require('./whitelist'); 
require('dotenv').config();
const db = require('croxydb');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

client.commands = new Collection();
const commands = [];

const { add, remove, has, list } = require('./blacklist');
const whitelist = loadWhitelist();

const getLogChannel = async (guild) => {
    const channelId = process.env.LOG_CHANNEL_ID;
    return guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId);
};

const loadCommands = async () => {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', file));
        if (command.data) {
            commands.push(command.data.toJSON()); 
            client.commands.set(command.data.name, command);
        } else if (command.name) {
            client.commands.set(command.name, command);
        } else {
            console.error(`Komut ${file} eksik veya hatalı.`);
        }
    }

    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

    try {
        console.log('Komutlar yükleniyor...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Komutlar başarıyla yüklendi!');
    } catch (error) {
        console.error('Komutlar yüklenirken bir hata oluştu:', error);
    }
};

const loadEvents = () => {
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(path.join(__dirname, 'events', file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
};

const logAction = async (guild, actionDescription) => {
    const logChannel = await getLogChannel(guild);
    if (logChannel) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Koruma Sistemi')
                .setDescription(actionDescription)
                .setColor('#FF0000') // Kırmızı renk
                .setTimestamp();
            
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Log kanalı mesaj gönderilirken bir hata oluştu:', error);
        }
    }
};

loadCommands();
loadEvents();

client.once(Events.ClientReady, async () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);

    try {
        await client.user.setPresence({
            activities: [{ name: 'Developed By LorieL', type: 'WATCHING' }],
            status: 'idle',
        });
        console.log('Durum ve oyun bilgisi başarıyla ayarlandı!');
    } catch (error) {
        console.error('Durum ayarlanırken bir hata oluştu:', error);
        console.error('Hata Detayı:', error.stack); 
    }
});


client.login(process.env.BOT_TOKEN);
