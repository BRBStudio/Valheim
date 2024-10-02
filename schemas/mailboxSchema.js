const { Schema, model } = require('mongoose');

const mailboxSchema = new Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    option: { type: String, required: true },
    feedback: { type: String, required: true },
    messageId: { type: String, required: true },
});

module.exports = model('Mailbox', mailboxSchema);