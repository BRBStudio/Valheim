module.exports = {
    name: 'messageCreate',
    execute(msg) {

        if(msg.content === '!bot') {
            msg.reply({content: `\`\`\`yml\nNày! hãy dùng lệnh /translate để dịch ngôn ngữ ( chỉ hỗ trợ tiếng anh và tiếng việt), hoặc dùng lệnh /bot-commands để nhận thông tin các lệnh có từ bot\`\`\``, ephemeral: true})
        }
    }
};
