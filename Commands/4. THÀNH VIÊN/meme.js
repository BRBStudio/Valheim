const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pepesign")
        .setDescription("Tạo biểu tượng cảm xúc ký hiệu pepe")
        .addStringOption(option =>
            option.setName("text")
                .setDescription("Văn bản cho biểu tượng cảm xúc")
                .setRequired(true)
        ),
    category: "Misc",
    async execute(interaction) {
        try {
            
            await interaction.deferReply();

            // Kiểm tra xem người dùng đã cung cấp văn bản hay không
            const signText = interaction.options.getString("text")?.trim();
            if (!signText) {
                return interaction.editReply("Vui lòng cung cấp văn bản cho biểu tượng cảm xúc Pepe.");
            }

            const canvas = Canvas.createCanvas(200, 200);
            const ctx = canvas.getContext("2d");

            // Đường dẫn đến hình ảnh blank sign
            const blankSignPath = path.join(__dirname, `../../anh/blanksign1.png`);

            const blankSign = await Canvas.loadImage(blankSignPath);

            const maxLineWidth = 60;
            let lines = [];
            let currentLine = "";
            const words = signText.split(" ");
            for (const word of words) {
                const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
                const testWidth = ctx.measureText(testLine).width;
                if (testWidth > maxLineWidth) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);
            const lineHeight = 30;
            const totalHeight = lines.length * lineHeight;
            const startY = (canvas.height - totalHeight) / 2;

            ctx.drawImage(blankSign, 0, 0, canvas.width, canvas.height);
            ctx.font = "30px Arial";
            ctx.fillStyle = "yellow";
            ctx.textAlign = "center";
            lines.forEach((line, index) => {
                const y = startY + index * lineHeight;
                ctx.fillText(line, canvas.width / 2, y);
            });

            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "pepesign.png" });

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Ký Hiệu Pepe")
                .setImage("attachment://pepesign.png")
                .setTimestamp();

            interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Xảy ra lỗi trong quá trình thực thi lệnh:", error);
            // Handle the error gracefully
            // Xử lý lỗi một cách graceful
        }
    }
};
