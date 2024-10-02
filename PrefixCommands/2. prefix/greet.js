// PrefixCommands/prefix/greet.js
module.exports = {
    name: 'greet',
    description: 'Chào mừng người dùng bằng tên của họ!',
    execute(message) {
        // Lấy tên người dùng từ đối tượng message
        const name = message.author.displayName;
        message.channel.send(`Chào mừng bạn, ${name}!`);
    },
};
