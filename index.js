const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const { User, Message, GuildMember } = Partials

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
const { loadButtons } = require('./Handlers/buttonHandler'); // Thêm dòng này

const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution
        ],
    partials: [User, Message, GuildMember],
});

const config = require('./config');
client.config = config;

// Version Control //
const currentVersion = `${config.botVersion}`;
const { checkVersion } = require('./lib/version');

client.commands = new Collection();
client.prefixCommands = new Collection(); // Thêm dòng này
client.buttons = new Collection(); // Thêm dòng này

// Nạp các lệnh button
const buttonPath = path.join(__dirname, 'buttons');
const buttonFiles = fs.readdirSync(buttonPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const button = require(path.join(buttonPath, file));
    // client.buttons.set(button.customId, button);
    client.buttons.set(button.id, button); // Đặt ID nút để xử lý sau này
}

client.login(process.env.token).then(() => {
    loadEvents(client);
    loadCommands(client);
    loadButtons(client); // Thêm dòng này
    checkVersion(currentVersion);
});

// Được Thực Hiện Bởi Valheim Survival