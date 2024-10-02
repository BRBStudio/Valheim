// nút tại ButtonBuilder.js
const { PermissionsBitField } = require(`discord.js`)
module.exports = {
    id: 'verify',
    async execute(interaction, client) {

        // Kiểm tra quyền của bot để quản lý vai trò
        const botMember = interaction.guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            await interaction.reply({ content: "Tôi cần quyền 'Quản lý vai trò' để thực hiện điều này.", ephemeral: true });
            return;
        }

        // Kiểm tra xem vai trò đã tồn tại chưa
        let role = interaction.guild.roles.cache.find(r => r.name === 'Thành Viên');
                            
        // Nếu vai trò không tồn tại, hãy tạo nó
        if (!role) {
            role = await interaction.guild.roles.create({
                name: 'Thành Viên',
                color: 'Blue', // mầu vai trò
                hoist: true, // hiển thị vai trò riêng biệt
                permissions: [
                    PermissionsBitField.Flags.ViewChannel, 
                    PermissionsBitField.Flags.ReadMessageHistory, 
                    PermissionsBitField.Flags.SendMessages
                ], // quyền hạn
            });
        } else {
            // nếu vai trò đã có thì sửa lại quyền hạn
            await role.edit({
                permissions: [
                    PermissionsBitField.Flags.ViewChannel, 
                    PermissionsBitField.Flags.ReadMessageHistory, 
                    PermissionsBitField.Flags.SendMessages
                ]
            });
        }

        // Kiểm tra xem người dùng đã có vai trò 'Thành Viên' chưa
        if (interaction.member.roles.cache.some(r => r.name === 'Thành Viên')) {
            // Nếu đã có vai trò, gửi thông báo và không làm gì hết
            await interaction.deferUpdate();
            return;       
        }

        // Lấy tất cả các vai trò hiện tại và sắp xếp chúng
        const roles = Array.from(interaction.guild.roles.cache.sort((a, b) => b.position - a.position).values());

        // Chèn vai trò mới vào vị trí mong muốn (thứ ba từ trên xuống)
        roles.splice(2, 0, role);

        // Tạo mảng vị trí mới
        const positions = roles.map((role, index) => ({ id: role.id, position: roles.length - index - 1 }));

        // Cập nhật thứ tự vai trò
        await interaction.guild.roles.setPositions(positions);
    
        // Cấp vai trò cho thành viên tương tác
        await interaction.member.roles.add(role);

        // Tạo chuỗi tên vai trò với tag
        const roleTag = role.toString();

        // Phản hồi với thông báo
        await interaction.reply({
            content: `Đã kích hoạt ***${roleTag}*** cho tài khoản bạn.`,
            ephemeral: true,
    });
    },
};
