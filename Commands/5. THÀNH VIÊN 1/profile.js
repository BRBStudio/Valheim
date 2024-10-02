const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const DB = require('../../schemas/profileDB');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Thông tin người dùng')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('view')
                .setDescription('Xem hồ sơ người dùng!')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('Người dùng trên hồ sơ bạn muốn xem.')
                        .setRequired(false),
                ),
        )
        .addSubcommand((subcommand) => subcommand.setName('create').setDescription('Nhận trợ giúp với lệnh!'))
        .addSubcommand((subcommand) => subcommand.setName('delete').setDescription('Xóa hồ sơ của bạn'))
        .addSubcommandGroup((group) =>
            group
                .setName('set')
                .setDescription('Thiết lập trang giới thiệu về tôi của bạn.')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('gender')
                        .setDescription('Đặt giới tính của bạn.')
                        .addStringOption((option) =>
                            option.setName('gender').setDescription('Nhập giới tính.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('age')
                        .setDescription('Đặt tuổi của bạn.')
                        .addNumberOption((option) =>
                            option.setName('age').setDescription('Nhập tuổi của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('birthday')
                        .setDescription('Đặt ngày sinh của bạn.')
                        .addStringOption((option) =>
                            option.setName('birthday').setDescription('Nhập ngày sinh của bạn (dd-MM-yyyy).').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('languages')
                        .setDescription('Đặt ngôn ngữ của bạn.')
                        .addStringOption((option) =>
                            option.setName('languages').setDescription('Nhập ngôn ngữ của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('origin')
                        .setDescription('Đặt nguồn gốc của bạn.')
                        .addStringOption((option) =>
                            option.setName('origin').setDescription('Nhập nguồn gốc của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('status')
                        .setDescription('Đặt trạng thái của bạn.')
                        .addStringOption((option) =>
                            option.setName('status').setDescription('Nhập trạng thái của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('hobbies')
                        .setDescription('Đặt sở thích của bạn.')
                        .addStringOption((option) =>
                            option.setName('hobbies').setDescription('Nhập sở thích của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('aboutme')
                        .setDescription('Đặt giới thiệu về bạn.')
                        .addStringOption((option) =>
                            option.setName('aboutme').setDescription('Nhập giới thiệu về bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('favorite-color')
                        .setDescription('Đặt màu yêu thích của bạn.')
                        .addStringOption((option) =>
                            option.setName('favorite-color').setDescription('Nhập màu yêu thích của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('favorite-animals')
                        .setDescription('Đặt động vật yêu thích của bạn.')
                        .addStringOption((option) =>
                            option.setName('favorite-animals').setDescription('Nhập động vật yêu thích của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('favorite-foods')
                        .setDescription('Đặt món ăn yêu thích của bạn.')
                        .addStringOption((option) =>
                            option.setName('favorite-foods').setDescription('Nhập món ăn yêu thích của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('favorite-songs')
                        .setDescription('Đặt bài hát yêu thích của bạn.')
                        .addStringOption((option) =>
                            option.setName('favorite-songs').setDescription('Nhập bài hát yêu thích của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('favorite-artists')
                        .setDescription('Đặt nghệ sĩ yêu thích của bạn.')
                        .addStringOption((option) =>
                            option.setName('favorite-artists').setDescription('Nhập nghệ sĩ yêu thích của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('favorite-movies')
                        .setDescription('Đặt phim yêu thích của bạn.')
                        .addStringOption((option) =>
                            option.setName('favorite-movies').setDescription('Nhập phim yêu thích của bạn.').setRequired(true),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('favorite-actors')
                        .setDescription('Đặt diễn viên yêu thích của bạn.')
                        .addStringOption((option) =>
                            option.setName('favorite-actors').setDescription('Nhập diễn viên yêu thích của bạn.').setRequired(true),
                        ),
                )
        )
        .addSubcommand((subcommand) => subcommand.setName('help').setDescription('Nhận trợ giúp với lệnh!')),

    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * .addChoices(
                                { name: "Mầu đỏ", value: "Mầu đỏ" }, // thông tin hiển thị là value
                                { name: "Mầu xanh dương", value: "Mầu xanh dương" },
                                { name: "Mầu xanh lá cây", value: "Mầu xanh lá cây" },
                                { name: "Mầu tím", value: "Mầu tím" },
                                { name: "Mầu cam", value: "Mầu cam" },
                                { name: "Mầu vàng", value: "Mầu vàng" },
                                { name: "Mầu đen", value: "Mầu đen" },
                                { name: "Mầu xanh lơ (rất đẹp)", value: "Mầu xanh lơ (rất đẹp)" },
                                { name: "Mầu hồng", value: "Mầu hồng" },
                                { name: "Mầu hoa oải hương", value: "Mầu hoa oải hương" },
                                { name: "Mầu sẫm (Mầu đỏ sẫm, hơi tím)", value: "Mầu sẫm (Mầu đỏ sẫm, hơi tím)" },
                                { name: "Mầu ô liu", value: "Mầu ô liu" },
                                { name: "Mầu xanh lam (xanh nước biển)", value: "Mầu xanh lam (xanh nước biển)" },
                                { name: "Mầu bạc", value: "Mầu bạc" },
                                { name: "Mầu vàng đồng", value: "Mầu vàng đồng" },
                                { name: "Mầu be", value: "Mầu be" },
                                { name: "Mầu hải quân (xanh dương đậm)", value: "Mầu hải quân (xanh dương đậm)" },
                                { name: "Mầu tím đậm", value: "Mầu tím đậm" },
                                { name: "Mầu hồng tím", value: "Mầu hồng tím" },
                              ),
     */
    async execute(interaction, client) {
        const { options } = interaction;

        // Xử lý các subcommand và subcommand group
        if (options.getSubcommandGroup() === 'set') {
            await setupAboutMe(client, interaction, DB);
        }

        switch (options.getSubcommand()) {
            case 'view':
                await handleViewProfile(client, interaction, DB);
                break;
            case 'create':
                await handleCreateProfile(interaction, DB, client);
                break;
            case 'delete':
                await handleDeleteProfile(interaction, DB, client);
                break;
            case 'help':
                await handleHelp(interaction, client);
                break;
            default:
                break;
        }
    },
};

async function setupAboutMe(client, interaction, DB) {
    if (!interaction.deferred) {
        await interaction.deferReply({ fetchReply: true });
    }

    const data = await DB.findOne({ userID: interaction.user.id });

    if (!data) {
        const noProfileEmbed = createErrorEmbed('Không tìm thấy hồ sơ nào! Tạo một hồ sơ với: /profile create!', client);
        return await interaction.editReply({ embeds: [noProfileEmbed] });
    }

    const { options } = interaction;
    const command = options.getSubcommand();
    const profile = data.profile;

    switch (command) {
        case 'age':
            profile[command] = options.getNumber(command);
            break;

        case 'birthday':
            try {
                const { format, parse } = require('date-fns');
                const bday = options.getString(command);
                const parsedDate = parse(bday, 'dd-MM-yyyy', new Date());
                const formattedDate = format(parsedDate, 'EEEE, do MMMM yyyy');
                profile[command] = formattedDate;
            } catch {
                profile[command] = options.getString(command);
            }
            break;

        case 'gender':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'languages':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'origin':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'status':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'hobbies':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'aboutme':
            profile[command] = options.getString(command);
            break;

        case 'favorite-color':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'favorite-animals':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'favorite-foods':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'favorite-songs':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'favorite-artists':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'favorite-movies':
          if (!profile.favorite) profile.favorite = {};
          profile.favorite[command.substring('favorite-'.length)] = options.getString(command);
          break;

        case 'favorite-actors':
            if (!profile.favorite) profile.favorite = {};
            profile.favorite[command.substring('favorite-'.length)] = options.getString(
                command.substring('favorite-'.length),
            );
            break;

        default:
            return;
    }

    data.save();
    const result =
        command.startsWith('favorite-') && profile.favorite
            ? profile.favorite[command.substring('favorite-'.length)]
            : profile[command];

    const successMessage = `${interaction.user.displayName} đã thiết lập của họ ${command} đến ${result}`;
    const profileEmbed = createSuccessEmbed(successMessage, client);

    await interaction.editReply({ embeds: [profileEmbed] });
}

async function handleViewProfile(client, interaction, DB) {
    const { options } = interaction;
    const viewUser = options.getMember('user') || interaction.member;
    if (!interaction.deferred) {
        await interaction.deferReply({ fetchReply: true });
    }

    const data = await DB.findOne({ userID: viewUser.user.id });
    if (!data) {
      const userName = viewUser.user.username; // Trích xuất tên người dùng từ đối tượng viewUser
        const noProfileEmbed = createNoProfileEmbed(client, interaction, userName);
        await interaction.editReply({ embeds: [noProfileEmbed] });
    } else {
        const aboutMeEmbed = createAboutMeEmbed(interaction, viewUser, data.profile);
        await interaction.editReply({ embeds: [aboutMeEmbed] });
    }
}

async function handleCreateProfile(interaction, DB, client) {
    if (!interaction.deferred) {
        await interaction.deferReply({ fetchReply: true });
    }

    const data = await DB.findOne({ userID: interaction.user.id });
    if (!data) {
        await DB.create({
            userID: interaction.user.id,
            lastUpdated: new Date(),
        });
        const noProfileSetEmbed = createNoProfileSetEmbed(client, interaction);
        await interaction.editReply({ embeds: [noProfileSetEmbed] });
    } else {
        const profileAlreadyExistsEmbed = createProfileAlreadyExistsEmbed(client, interaction);
        await interaction.editReply({ embeds: [profileAlreadyExistsEmbed] });
    }
}

async function handleDeleteProfile(interaction, DB, client) {
    if (!interaction.deferred) {
        await interaction.deferReply({ fetchReply: true });
    }

    const data = await DB.findOneAndDelete({ userID: interaction.user.id });
    if (!data) {
        const noProfileEmbed = createErrorEmbed('Không tìm thấy hồ sơ nào để xóa!', client);
        await interaction.editReply({ embeds: [noProfileEmbed] });
    } else {
        const successEmbed = createSuccessEmbed(`${interaction.user.displayName} đã xóa hồ sơ của họ.`, client);
        await interaction.editReply({ embeds: [successEmbed] });
    }
}

async function handleHelp(interaction, client) {
    const helpEmbed = createHelpEmbed(client, interaction);
    await interaction.reply({ embeds: [helpEmbed] });
}

function createErrorEmbed(message, client) {
    const emoji = client.emoji && client.emoji.basic ? client.emoji.basic : '';
    return new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${emoji} **Lỗi**\n\n> ${message}`)
        .setFooter({ text: `${client.footer}`, iconURL: client.user.displayAvatarURL() })
        .setColor('#2b2d31')
        .setTimestamp();
}

function createSuccessEmbed(message, client) {
    const emoji = client.emoji && client.emoji.basic ? client.emoji.basic : '';
    return new EmbedBuilder()
        .setTitle('Thành công')
        .setDescription(`${emoji} ${message}`)
        .setFooter({ text: `${client.footer}`, iconURL: client.user.displayAvatarURL() })
        .setColor('#2b2d31')
        .setTimestamp();
}

function createNoProfileEmbed(client, interaction, userName) {
    const emoji = client.emoji && client.emoji.basic ? client.emoji.basic.help : '';
    return new EmbedBuilder()
        .setTitle(`Hồ sơ của ${userName}`)
        .setDescription(`${emoji} **Không tìm thấy hồ sơ nào!**\n\n> Tạo một hồ sơ với: /profile create!`)
        .setFooter({ text: `${client.footer}`, iconURL: client.user.displayAvatarURL() })
        .setColor('#2b2d31')
        .setTimestamp();
}

function createAboutMeEmbed(interaction, viewUser, profileData) {
    const { favorite, gender, age, birthday, languages, badges, origin, status, hobbies, aboutme } = profileData;
    const { color, animals, foods, songs, artists, movies, actors } = favorite || {};

    return new EmbedBuilder()
        .setTitle(`Hồ sơ người dùng ${viewUser.displayName}`)
        .addFields(
            { name: '💳 Tên', value: `\`\`\`${viewUser.displayName}\`\`\``, inline: true },
            { name: '🆔 ID', value: `\`\`\`${viewUser.id}\`\`\``, inline: true },
            { name: '📓 người dùng có #', value: `\`\`\`#${viewUser.user.discriminator}\`\`\``, inline: true }, // Discriminator
            { name: '⚤ Giới tính', value: `\`\`\`${gender || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🔞 Tuổi', value: `\`\`\`${age || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🎂 Ngày sinh', value: `\`\`\`${birthday || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🌐 Ngôn ngữ', value: `\`\`\`${languages || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🏅 Huy hiệu', value: `\`\`\`${badges || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🔍 Nguồn gốc', value: `\`\`\`${origin || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🟢 Trạng thái', value: `\`\`\`${status || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🎮 Sở thích', value: `\`\`\`${hobbies || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '👀 Giới thiệu về tôi', value: `\`\`\`${aboutme || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🌈 Màu yêu thích', value: `\`\`\`${color || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🐱🐶 Động vật yêu thích', value: `\`\`\`${animals || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🍕🍣 Món ăn yêu thích', value: `\`\`\`${foods || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🎵 Bài hát yêu thích', value: `\`\`\`${songs || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🎤 Nghệ sĩ yêu thích', value: `\`\`\`${artists || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🎬 Phim yêu thích', value: `\`\`\`${movies || 'Chưa được thiết lập'}\`\`\``, inline: true },
            { name: '🎭 Diễn viên yêu thích', value: `\`\`\`${actors || 'Chưa được thiết lập'}\`\`\``, inline: true },
        )
        .setFooter({
            text: `DÙNG LỆNH /profile create ĐỂ TẠO HỒ SƠ`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 512 }),
        })
        .setThumbnail(viewUser.displayAvatarURL())
        .setColor('#2b2d31')
        .setTimestamp();
}

function createNoProfileSetEmbed(client, interaction) {
    const emoji = client.emoji && client.emoji.basic ? client.emoji.basic.user : '';
    return new EmbedBuilder()
        .setTitle('Thành công')
        .setDescription(
            `${emoji} **Đã được chấp nhận**\n\n> ${interaction.user.displayName} đã tạo một hồ sơ mới.`,
        )
        .setFooter({ text: `${client.footer}`, iconURL: client.user.displayAvatarURL() })
        .setColor('#2b2d31')
        .setTimestamp();
}

function createProfileAlreadyExistsEmbed(client, interaction) {
    const emoji = client.emoji && client.emoji.basic ? client.emoji.basic.user : '';
    return new EmbedBuilder()
        .setTitle('Lỗi')
        .setDescription(
            `${emoji} **Lỗi**\n\n> ${interaction.user.displayName} đã có một hồ sơ.`,
        )
        .setFooter({ text: `${client.footer}`, iconURL: client.user.displayAvatarURL() })
        .setColor('#2b2d31')
        .setTimestamp();
}

function createHelpEmbed(client, interaction) {
  let emoji = '❓'; // Sử dụng emoji mặc định nếu không có emoji được cung cấp
  if (client.emoji && client.emoji.basic && client.emoji.basic.help) {
    emoji = client.emoji.basic.help;
}
    return new EmbedBuilder()
        .setTitle('Trợ giúp với hồ sơ của bạn!')
        .setDescription(`${emoji} **Trợ giúp**\n\n` +
            '```' +
            '/profile create\n' +
            '➢ Tạo hồ sơ của bạn.\n\n' +
            '/profile view <người dùng>\n' +
            '➢ Xem hồ sơ người dùng.\n\n' +
            '/profile set <lựa chọn>\n' +
            '➢ Thiết lập hồ sơ của bạn với thông tin mới.\n\n' +
            '/profile delete\n' +
            `➢ Xóa hồ sơ của bạn.\n` +
            '```'
        )
        .setFooter({ text: `Về tôi`, iconURL:  client.user.displayAvatarURL({ dynamic: true, size: 512 })})
        .setColor('#2b2d31')
        .setTimestamp();
}

//.setFooter({ text: `${client.footer}`, iconURL: client.user.displayAvatarURL() })
