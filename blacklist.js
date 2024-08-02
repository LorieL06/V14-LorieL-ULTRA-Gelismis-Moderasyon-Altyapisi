const db = require('croxydb'); 

const blacklistKey = 'blacklist';

module.exports = {
    add: (userId) => {
        let blacklist = db.get(blacklistKey) || [];
        if (!blacklist.includes(userId)) {
            blacklist.push(userId);
            db.set(blacklistKey, blacklist);
        }
    },

    remove: (userId) => {
        let blacklist = db.get(blacklistKey) || [];
        db.set(blacklistKey, blacklist.filter(id => id !== userId));
    },

    has: (userId) => {
        let blacklist = db.get(blacklistKey) || [];
        return blacklist.includes(userId);
    },

    list: () => {
        return db.get(blacklistKey) || [];
    }
};
