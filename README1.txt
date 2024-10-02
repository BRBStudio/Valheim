** cách sử dụng git mục này làm theo thứ tự:
        git init
        git remote add origin <link github>
        git add . [lưu thay đổi]
        git commit -m "Initial commit" [để tạo tên commit]
        git push -u origin (master) hoặc (main) [để đẩy lên github mới]



** cách chuyển đổi từ master qua main hoặc người lại
        git branch -m master main [Lệnh này sẽ đổi tên nhánh master hiện tại thành main trong repository cục bộ.]
        git push origin --delete master [sau đó dụng cái này để xóa master/main]
        git push -u origin main [dùng để đẩy nhánh main/marter]
        git pull origin main --rebase [để hợp nhất nhánh main]
        git push -u origin main [Đẩy các thay đổi lên remote]
        git rebase --continue [dùng để Tiếp tục quá trình rebase]
        git status [kiểm tra trạng thái hiện tại]
        git branch --unset-upstream [dùng để xóa upstream cũ]
        git branch -u origin/main [dùng để Thiết lập upstream mới]



** Nếu bạn chưa đẩy nhánh main lên remote trước đó, bạn có thể sử dụng lệnh sau để đẩy nhánh main lên và thiết lập upstream:
        git push -u origin main
        git
        [các để đẩy thay đổi lên github]
        git add . [để lưu thay đổi]
        git commit -m "Mô tả ngắn gọn về thay đổi"
        git push hoặc git <push tên nhánh>
        git pull [để bạn hoặc người thú 2 update code mới được up lên]



- 1. cd "E:\16-10 BRB BOT DISCORD\7.Moi"  chuyển đến thư mục E:\16-10 BRB BOT DISCORD\7.Moi