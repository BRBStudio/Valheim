const { SlashCommandBuilder } = require('discord.js');
const { createStatsEmbed } = require('../../Embeds/embedsCreate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info-bot')
		.setDescription('Nhận thông tin về bot')
		.setDMPermission(true),

async execute(interaction, client) {

		const guildOwner = await interaction.guild.fetchOwner();

		if (interaction.user.id !== guildOwner.id) {
			return await interaction.reply({ content: 'Lệnh này chỉ dành cho chủ sở hữu.', ephemeral: true });
		}

		// Tạo embed thông tin thống kê bằng hàm createStatsEmbed
		const statsEmbed = await createStatsEmbed(client, interaction);

		// Cập nhật phản hồi với embed thông tin thống kê
		await interaction.editReply({ embeds: [statsEmbed] });

	},
};



// const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, version } = require('discord.js');
// const os = require('node:os');
// const osu = require('node-os-utils');
// require('loadavg-windows');
// const cpuStat = require('cpu-stat');

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('info-bot')
// 		.setDescription('Nhận thông tin về bot')
// 		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
// 		.setDMPermission(true),
// 	/**
//      * cài đặt npm install loadavg-windows
//      * cài đặt npm install node-os-utils
//      */
// 	async execute(interaction, client) {
// 		const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏓 | Đang tìm nạp số liệu thống kê...').setColor('Red')] });

// 		const meminfo = await osu.mem.info();
// 		const usedPercent = meminfo.usedMemPercentage;
// 		const freePercent = meminfo.freeMemPercentage;
// 		const usedMem = os.totalmem() - os.freemem();

// 		const cpu = os.cpus()[0];

// 		try {
// 			const statsEmbed = new EmbedBuilder()
// 				.setTitle(`\:chart_with_upwards_trend: Số liệu thống kê của ${client.user.username}`)
// 				.setColor('Random')
// 				.setDescription(`\`\`\`yml\nTên: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nĐộ trễ API: ${client.ws.ping}ms\nĐộ trễ người dùng: ${Math.floor(msg.createdAt - interaction.createdAt)}ms\nThời gian hoạt động: ${formatUptime(client.uptime)}\`\`\``)
// 				.addFields([
// 					{
// 						name: ':bar_chart: Thống kê chung',
// 						value: `\`\`\`yml\nTổng số máy chủ: ${client.guilds.cache.size}\nNgười dùng: ${client.guilds.cache.map((e) => e.memberCount).reduce((a, b) => a + b, 0).toLocaleString()}\nDiscordJS: v${version}\nNodeJS: ${process.version}\`\`\``,
// 						inline: false,
// 					},
// 					{
// 						name: ':gear: Thống kê hệ thống',
// 						value: `\`\`\`yml\nHệ điều hành: ${os.type().replace('Windows_NT', 'Windows').replace('Darwin', 'macOS')}\nPhiên bản của hệ điều hành: ${os.platform() + ' ' + os.release()}\nThời gian hoạt động: ${formatUptime(os.uptime())}\nCPU: ${os.arch()}\`\`\``,
// 						inline: false,
// 					},
// 					{
// 						name: '\:file_cabinet: Thống kê CPU',
// 						value: `\`\`\`yml\nChip ${cpu?.model}\nTốc độ: ${cpuStat.avgClockMHz().toFixed(0)} MHz\nLõi: ${osu.cpu.count()}\nSử dụng CPU: ${calculateCpuUsage()}% / 50%\`\`\``,
// 						inline: true,
// 					},
// 					{
// 						name: '\:straight_ruler: Thống kê RAM',
// 						value: `\`\`\`yml\nTổng bộ nhớ: ${formatBytes(os.totalmem())}\nbộ nhớ còn trống: ${formatBytes(os.freemem())} (${freePercent}%)\nBộ nhớ đã sử dụng: ${formatBytes(usedMem)} (${usedPercent.toFixed(1)}%)\nBộ nhớ đệm: ${calculateCachedMemoryGB()} GB\`\`\``,
// 						inline: false,
// 					},
// 					{

// 						name: '\:man_technologist_tone1: Thống kê khác',
// 						value: `\`\`\`yml\nSố lượng lệnh: ${client.commands.size}\nSố lượng kênh: ${client.channels.cache.size.toLocaleString()}\nEmojis: ${client.emojis.cache.size.toLocaleString()}\`\`\``,
// 						inline: true,

// 					},
//                     { name: `\`⚙️\`** | Nhà phát triển:**`, value: `\`\`\`yml\nValheim Survival\`\`\``, inline: true }, // Người sản xuất. Thay đổi nó thành bất cứ điều gì bạn muốn
// 				])
// 				.setThumbnail(`https://i.imgur.com/9bQGPQM.gif`) //.setThumbnail(`https://media1.tenor.com/m/KP9EXmxDolMAAAAC/brb-neon.gif`)
//                 .setImage(`https://i.imgur.com/mBvxp6R.gif`) //.setImage(`https://i.imgur.com/4CsxTNT.gif`)
// 				.setFooter({ text: 'Phiên bản: v1.1.0' });
// 			await interaction.editReply({ embeds: [statsEmbed] });
// 		}
// 		catch (error) {
// 			console.log(error);
// 		}


// 	},
// };


// function calculateCachedMemoryGB() {
// 	const totalMemoryGB = os.totalmem() / (1024 * 1024 * 1024); // Total system memory in GB
// 	const freeMemoryGB = os.freemem() / (1024 * 1024 * 1024); // Free system memory in GB
// 	const usedMemoryGB = totalMemoryGB - freeMemoryGB; // Used system memory in GB

// 	// Calculate cached memory as the difference between used memory and actual application memory
// 	const cachedMemoryGB = usedMemoryGB - (process.memoryUsage().heapUsed / (1024 * 1024 * 1024));

// 	return cachedMemoryGB.toFixed(0);
// }

// // Function to calculate adjusted CPU usage percentage based on 0.5 vCores (50% limit)
// function calculateCpuUsage() {
// 	const cpus = os.cpus();
// 	const adjustedTotalCores = cpus.length / 2;

// 	// Calculate total usage across all CPU cores
// 	const totalUsage = cpus.reduce((acc, core) => acc + core.times.user + core.times.nice + core.times.sys + core.times.idle, 0);

// 	// Calculate CPU usage percentage based on adjusted total cores
// 	const cpuPercentage = ((1 - cpus[0].times.idle / totalUsage) * adjustedTotalCores) / 10;

// 	return cpuPercentage.toFixed(2);
// }

// function formatUptime(uptime) {
// 	const seconds = Math.floor(uptime % 60);
// 	const minutes = Math.floor((uptime / 60) % 60);
// 	const hours = Math.floor((uptime / (60 * 60)) % 24);
// 	const days = Math.floor(uptime / (60 * 60 * 24));

// 	return `d ${days}・h ${hours}・m ${minutes}・s ${seconds}`;
// }

// function formatBytes(bytes) {
// 	let size;
// 	if (bytes < 1000) size = `${bytes} B`;
// 	else if (bytes < 1000000) size = `${(bytes / 1000).toFixed(2)} KB`;
// 	else if (bytes < 1000000000) size = `${(bytes / 1000000).toFixed(2)} MB`;
// 	else if (bytes < 1000000000000) size = `${(bytes / 1000000000).toFixed(2)} GB`;
// 	else if (bytes < 1000000000000000) size = `${(bytes / 1000000000000).toFixed(2)} TB`;
// 	return size;
// }