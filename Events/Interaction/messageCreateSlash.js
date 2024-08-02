// Events/Message/messageCreateSlash.js
const AntiwordConfig = require('../../schemas/antiwordSchema.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
      if (!message.guild || message.author.bot) return;
  
      try {
        const guildConfig = await AntiwordConfig.findOne({ guildId: message.guild.id });
  
        if (guildConfig && guildConfig.badWords.length > 0) {
          const messageContent = message.content.toLowerCase();
          const foundInText = guildConfig.badWords.some(word => messageContent.includes(word));
  
          if (foundInText) {
            const now = new Date();
            const dayOfWeek = now.toLocaleString('vi-VN', { weekday: 'long' });
            const month = now.toLocaleString('vi-VN', { month: 'long' });
            const day = now.toLocaleString('vi-VN', { day: 'numeric' });
            const year = now.getUTCFullYear();
  
            const logEmbed = new EmbedBuilder()
              .setTitle(`Hệ thống kiểm duyệt tự động`)
              .setColor('White')
              .setThumbnail('https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTHsK1ZoItA_jI8Qsh_g-KScUGYtHjh5MqFuQGjFQAXyKD8UYneQToPyqYOgGzQWnbl')
              .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
              .setTimestamp()
              .addFields(
                {
                  name: '🙋‍♂️ **Từ**',
                  value: `${message.author}`,
                  inline: false,
                },
                {
                  name: '📜 **Tin nhắn**',
                  value: `${message.content}`,
                  inline: true,
                },
                {
                  name: '🕓 Ngày',
                  value: `${dayOfWeek} ngày ${day} ${month} Năm ${year}`,
                  inline: true,
                }
              );
  
            const logChannelId = guildConfig.selectedChannelId;
            const logChannel = message.guild.channels.cache.get(logChannelId);
            if (logChannel) {
              logChannel.send({ embeds: [logEmbed] });
            }
  
            const embed = new EmbedBuilder()
              .setTitle(`Hệ thống kiểm duyệt tự động`)
              .setColor('Red')
              .setTimestamp()
              .setThumbnail('https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTHsK1ZoItA_jI8Qsh_g-KScUGYtHjh5MqFuQGjFQAXyKD8UYneQToPyqYOgGzQWnbl')
              .setDescription(`${message.author}, tin nhắn của bạn đã bị hệ thống kiểm duyệt tự động của chúng tôi phát hiện vì vi phạm các quy tắc máy chủ của chúng tôi. Tình trạng này sẽ được điều tra thêm.`)
              .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`);
  
            message.author.send({ embeds: [embed] }).catch(error => {
              console.error('Lỗi khi gửi tin nhắn DM:', error);
            });
  
            message.delete().catch(error => {
              console.error('Lỗi khi xóa tin nhắn:', error);
            });
          }
        }
      } catch (error) {
        console.error('Lỗi khi xử lý tin nhắn:', error);
      }
    },
  };
  