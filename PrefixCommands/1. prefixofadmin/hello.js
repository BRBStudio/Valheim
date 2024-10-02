// PrefixCommands/prefix/hello.js
module.exports = {
    name: 'hello',
    description: 'Trả lời bằng lời chào!',
    execute(message) {
        message.channel.send('thích không!');
    },
};
