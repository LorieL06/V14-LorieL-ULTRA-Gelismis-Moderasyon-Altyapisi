const loadCommands = async () => {
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', file));
        if (command.data && command.data.name) {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`Komut dosyası ${file} uygun yapılandırmaya sahip değil.`);
        }
    }

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Komutlar yükleniyor...');

        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log('Komutlar başarıyla yüklendi!');
    } catch (error) {
        console.error('Komutlar yüklenirken bir hata oluştu:', error);
    }
};
