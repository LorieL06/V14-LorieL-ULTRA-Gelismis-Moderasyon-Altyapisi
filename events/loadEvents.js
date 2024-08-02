const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.MessageCreate, 
    once: false,
    async execute(message, client) {
        if (message.author.bot) return;

    },
};
