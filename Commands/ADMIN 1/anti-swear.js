// anti-swear.js
const AntiwordConfig = require('../../schemas/antiwordSchema');
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anti-swear')
    .setDescription('🤬 | Cấu hình hệ thống chống chửi thề')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addSubcommand(command => command.setName("addword").setDescription('🤬 | Thêm một từ vào danh sách từ xấu').addStringOption(option => option.setName('badword').setDescription('Từ bạn muốn thêm').setRequired(true)))
    .addSubcommand(command => command.setName('channel').setDescription('🤬 | Kênh kiểm duyệt người dùng đã dùng từ xấu').addChannelOption(option => option.setName('channels').setDescription('kênh mà bạn muốn tin nhắn đến').setRequired(true)))
    .addSubcommand(command => command.setName('remove').setDescription('🤬 | Xóa một từ khỏi danh sách từ xấu').addStringOption(option => option.setName('word').setDescription('Từ cần xóa').setRequired(true)))
    .addSubcommand(command => command.setName('list').setDescription('🤬 | Xem danh sách từ xấu'))
    .addSubcommand(command => command.setName('removeall').setDescription('🤬 | Xóa tất cả từ xấu')),

  async execute(interaction) {

    if (!interaction.guild) {
      interaction.reply("Bạn chỉ có thể dùng lệnh của bot ở trong sever");
      return;
  }

    const sub = interaction.options.getSubcommand();

    try { 
      switch (sub) {
        case "addword":
          const guildId = interaction.guild.id;
          const badword = interaction.options.getString('badword').toLowerCase();
          let guildConfig = await AntiwordConfig.findOne({ guildId });

          if (!guildConfig) {
            guildConfig = new AntiwordConfig({
              guildId: guildId,
              badWords: [badword]
            });
          } else {
            if (!guildConfig.badWords) {
              guildConfig.badWords = [badword];
            } else {
              // Kiểm tra xem từ đó đã tồn tại trong mảng badWords chưa
              if (!guildConfig.badWords.includes(badword)) {
                guildConfig.badWords.push(badword);
              } else {
                // Nếu từ đã tồn tại, hãy gửi tin nhắn cho biết rằng
                interaction.reply(`Từ **${badword}** đã tồn tại trong danh sách từ xấu.`);
                return;
              }
            }
          }

          await guildConfig.save();

          const embedAdd = new EmbedBuilder()
            .setColor('#00FF00') 
            .setDescription(` Thành công!\n Đã thêm **${badword}** vào danh sách từ xấu`)
            .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`);

          interaction.reply({ embeds: [embedAdd] });
          break;

        case "remove":
          const word = interaction.options.getString('word').toLowerCase();
          const guildIdToRemove = interaction.guild.id;

          await AntiwordConfig.findOneAndUpdate(
            { guildId: guildIdToRemove },
            { $pull: { badWords: word } }
          );

          const embedRemove = new EmbedBuilder()
            .setColor('#00FF00') 
            .setDescription(`⛔ Thành công!\n🛑 Đã xóa **${word}** khỏi danh sách từ xấu`)
            .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
            .setTimestamp();

          await interaction.reply({ embeds: [embedRemove] });
          break;

        case "list":
          const guildIdToList = interaction.guild.id;
          const guildConfigToList = await AntiwordConfig.findOne({ guildId: guildIdToList });

          if (!guildConfigToList || !guildConfigToList.badWords || guildConfigToList.badWords.length === 0) {
            const nowords = new EmbedBuilder()
              .setColor('#FF0000') 
              .setDescription(`\`❗ Không có từ nào trong danh sách từ xấu!\``)
              .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
              .setTimestamp();

            return interaction.reply({ embeds: [nowords] });
          } else {
            const listembed = new EmbedBuilder()
              .setAuthor({ name: `Đây là danh sách những từ xấu`, iconURL: interaction.guild.iconURL() })
              .setDescription(`*${guildConfigToList.badWords.join('\n')}*`)
              .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
              .setColor('#00FF00'); 
            await interaction.reply({ embeds: [listembed] });
          }
          break;

        case "channel":
          const selectedChannel = interaction.options.getChannel('channels');
          const guildIdForChannel = interaction.guild.id;

          await AntiwordConfig.findOneAndUpdate(
            { guildId: guildIdForChannel },
            { selectedChannelId: selectedChannel.id }
          );

          interaction.reply(`Tin nhắn đã được gửi vào kênh ${selectedChannel} để bạn kiểm duyệt.`);
          break;

        case "removeall":
          const guildIdToRemoveAll = interaction.guild.id;

          await AntiwordConfig.findOneAndUpdate(
            { guildId: guildIdToRemoveAll },
            { badWords: [] } // Xóa tất cả các từ xấu
          );

          interaction.reply(`Đã xóa tất cả từ xấu khỏi danh sách.`);
          break;

        default:
          throw new Error('Lệnh không được hỗ trợ.');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = 'Có lỗi xảy ra trong quá trình xử lý lệnh.';
      interaction.reply(errorMessage);
    }
  }
};










// const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// const fs = require('fs');
// const tinycolor = require('tinycolor2');
// const AntiwordSettings = require('./schemas/antiwordSchema');

// const badWordsFile = 'badwords.json';
// let badWords = [];

// // Kiểm tra xem tệp badwords.json có tồn tại không, nếu không thì tạo mới
// if (fs.existsSync(badWordsFile)) {
//   try {
//     const data = fs.readFileSync(badWordsFile, 'utf8');
//     badWords = JSON.parse(data);
//   } catch (err) {
//     console.error('Lỗi khi đọc tệp badwords.json:', err);
//   }
// }

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('anti-swear')
//     .setDescription('🤬 | Cấu hình hệ thống chống chửi thề')
//     .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
//     .addSubcommand(command => command.setName("addword").setDescription('🤬 | Thêm một từ vào danh sách từ xấu').addStringOption(option => option.setName('badword').setDescription('Từ bạn muốn thêm').setRequired(true)))
//     .addSubcommand(command => command.setName('channel').setDescription('🤬 | Kênh kiểm duyệt người dùng đã dùng từ xấu').addChannelOption(option => option.setName('channels').setDescription('kênh mà bạn muốn tin nhắn đến').setRequired(true)))
//     .addSubcommand(command => command.setName('remove').setDescription('🤬 | Xóa một từ khỏi danh sách từ xấu').addStringOption(option => option.setName('word').setDescription('Từ cần xóa').setRequired(true)))
//     .addSubcommand(command => command.setName('list').setDescription('🤬 | Xem danh sách từ xấu')),

//   async execute(interaction) {
//     const sub = interaction.options.getSubcommand();
//     const channel = interaction.options.getChannel('channel')

//     try {
//       switch (sub) {
//         case "addword":
//           const badword = interaction.options.getString('badword').toLowerCase();

//           if (badWords.includes(badword)) {
//             const already = new EmbedBuilder()
//               .setDescription(`\`❗ ${badword} đã nằm trong danh sách từ xấu!\``)
//               .setColor('#FF0000') // Set a default color
//               .setTimestamp();

//             return interaction.reply({ embeds: [already] });
//           }

//           badWords.push(badword);
//           fs.writeFileSync(badWordsFile, JSON.stringify(badWords, null, 2));

//           const embedAdd = new EmbedBuilder()
//             .setColor('#00FF00') // Set a success color
//             .setDescription(` Thành công!\n Đã thêm **${badword}** vào danh sách từ xấu`);

//           interaction.reply({ embeds: [embedAdd] });
//           break;

//         case "remove":
//           const word = interaction.options.getString('word').toLowerCase();

//           if (!badWords.includes(word)) {
//             const noData = new EmbedBuilder()
//               .setColor('#FF0000') // Set a default color
//               .setDescription(`\`❗ ${word} không có trong danh sách từ xấu!\``)
//               .setTimestamp();

//             return interaction.reply({ embeds: [noData] });
//           }

//           badWords.splice(badWords.indexOf(word), 1);
//           fs.writeFileSync(badWordsFile, JSON.stringify(badWords, null, 2));

//           const embedRemove = new EmbedBuilder()
//             .setColor('#00FF00') // Set a success color
//             .setDescription(`<:tickred51:1240060253240819843> Thành công!\n<:_verified_:1240060278863958056> Đã xóa **${word}** khỏi danh sách từ xấu`)
//             .setTimestamp();

//           await interaction.reply({ embeds: [embedRemove] });
//           break;

//         case "list":
//           const nowords = new EmbedBuilder()
//             .setColor('#FF0000') // Set a default color
//             .setDescription(`\`❗ Không có từ nào trong danh sách từ xấu!\``)
//             .setTimestamp();

//           if (badWords.length === 0) return interaction.reply({ embeds: [nowords] });
//           else {
//             const listembed = new EmbedBuilder()
//               .setAuthor({ name: `Đây là danh sách những từ xấu`, iconURL: interaction.guild.iconURL() })
//               .setDescription(`*${badWords.join('\n')}*`)
//               .setColor('#00FF00'); // Set a success color

//             await interaction.reply({ embeds: [listembed] });
//           }
//           break;

//         case "channel":
//           const selectedChannel = interaction.options.getChannel('channels');
//           if (!selectedChannel) {
//               return interaction.reply("Hãy chọn một kênh.");
//           }
//           interaction.reply(`Tin nhắn sẽ được gửi vào kênh ${selectedChannel}.`);
//           interaction.client.selectedChannel = selectedChannel; // Lưu trữ kênh được chọn để sử dụng messageCreate.js
//           break;

        

//         default:
//           throw new Error('Lệnh không được hỗ trợ.');
//       }

//       // Kiểm tra từ ngữ xấu trong nội dung tin nhắn
//       if (interaction.isCommand() && interaction.inGuild() && badWords.length > 0 && sub !== "list") {
//         let messageContent = "";
//         if (sub === "add") {
//           messageContent = interaction.options.getString('badword').toLowerCase();
//         }

//         for (const word of badWords) {
//           if (messageContent.includes(word)) {
//             // Send an embed message to the user
//             const embedWarning = new EmbedBuilder()
//               .setColor('#FF0000') // Set a warning color
//               .setDescription(`Bạn đã thêm từ "${word}" là từ xấu.`)
//               .setTimestamp();

//             interaction.reply({ embeds: [embedWarning] });
//             return; // Dừng xử lý thêm để tránh thực hiện hành động mặc định
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       const errorMessage = 'Có lỗi xảy ra trong quá trình xử lý lệnh.';
//       interaction.reply(errorMessage);
//     }
//   }
// };
