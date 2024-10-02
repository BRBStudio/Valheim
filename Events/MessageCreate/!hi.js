module.exports = {
    name: 'messageCreate',
    execute(msg) {
        if(msg.content === '!hi') {
            // Lấy tên guild từ đối tượng msg.guild
          const guildName = msg.guild ? msg.guild.name : 'Máy chủ không xác định';

          msg.reply({content: `\`\`\`yml\nChào mừng bạn đến với máy chủ ***${guildName}*** !!!\n\nNếu bạn có vấn đề gì muốn biết, bạn có thể hỏi mọi người hoặc dùng các lệnh / của bot ***Valheim Survival*** để được hỗ trợ nhé. Hi vọng bạn sẽ có những trải nghiệm vui vẻ...\`\`\``, ephemeral: true})
        }
    }
};
