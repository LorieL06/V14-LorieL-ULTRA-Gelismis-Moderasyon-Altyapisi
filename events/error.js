const { Events } = require('discord.js');

module.exports = {
    name: Events.ERROR,
    async execute(error) {
        console.error('Botta bir hata oluştu:', error);
    },
};
