
module.exports = {
    name: 'example',
    description: 'Bir örnek komut',
    async execute(interaction, db) {
        db.set('example_key', 'example_value');

        const value = db.get('example_key');

        await interaction.reply(`Veri: ${value}`);
    },
};
