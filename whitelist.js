const fs = require('fs');

const loadWhitelist = () => {
    if (!fs.existsSync('whitelist.json')) {
        fs.writeFileSync('whitelist.json', JSON.stringify([]));
    }
    return new Set(JSON.parse(fs.readFileSync('whitelist.json')));
};

const saveWhitelist = (whitelist) => {
    fs.writeFileSync('whitelist.json', JSON.stringify(Array.from(whitelist)));
};

module.exports = { loadWhitelist, saveWhitelist };
