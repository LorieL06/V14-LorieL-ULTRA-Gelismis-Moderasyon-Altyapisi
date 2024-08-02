const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

// Sessizlikten çıkarılacak kanalların ID'leri
const MUTE_CHANNEL_IDS = [
    "1208202861218107402",
    "1208202960702803998",
    "1208202991375482902",
    "1254500191931990016",
    "1255586473437171832",
    "1264288914013683723"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Belirtilen kullanıcıyı belirli kanallarda sessizlikten çıkarır.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Sessizlikten çıkarılacak kullanıcı')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');

        if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli izniniz yok.', ephemeral: true });
        }

        const targetMember = interaction.guild.members.resolve(targetUser.id);

        if (!targetMember) {
            return interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', ephemeral: true });
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            for (const channelId of MUTE_CHANNEL_IDS) {
                const channel = interaction.guild.channels.cache.get(channelId);
                if (channel && channel.type === ChannelType.GuildText) {
                    await channel.permissionOverwrites.edit(targetMember.id, {
                        SendMessages: true,
                    });
                }
            }

            await interaction.editReply({ content: `${targetUser.tag} başarıyla sessizlikten çıkarıldı.` });
        } catch (error) {
            console.error('Sessizlikten çıkarma sırasında bir hata oluştu:', error);
            await interaction.editReply({ content: 'Kullanıcı sessizlikten çıkarılırken bir hata oluştu.' });
        }
    },
};
