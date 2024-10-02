// PrefixCommands/help.js
module.exports = {
    name: 'help',
    description: 'giúp đỡ!',
    execute(msg) {
        // Lấy tên người dùng từ đối tượng message
        const name = msg.author.displayName;
        msg.channel.send({content: `\`\`\`yml\nNày ${name}! hãy dùng lệnh /translate để dịch ngôn ngữ ( chỉ hỗ trợ tiếng anh và tiếng việt), hoặc dùng lệnh /bot-commands để nhận thông tin các lệnh có từ bot\`\`\``, ephemeral: true})
    },
};
