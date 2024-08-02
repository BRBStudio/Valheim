// PrefixCommands/hello.js
module.exports = {
    name: 'hello',
    description: 'Trả lời bằng lời chào!',
    execute(message, args) {
        message.reply('thích không!');
    },
};
