const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');

class VoiceQueue {
    constructor() {
        this.queue = []; // Hàng đợi để lưu trữ các yêu cầu
        this.isProcessing = false; // Biến kiểm tra xem bot có đang xử lý sự kiện nào không
        this.currentConnection = null; // Kết nối hiện tại
    }

    // Thêm yêu cầu vào hàng đợi
    addToQueue(request) {
        this.queue.push(request);
        if (!this.isProcessing) {
            this.processQueue(); // Nếu không đang xử lý, bắt đầu xử lý hàng đợi
        }
    }

    // Hàm xử lý hàng đợi
    async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false; // Không còn yêu cầu nào để xử lý
            if (this.currentConnection) {
                this.currentConnection.destroy(); // Ngắt kết nối nếu không có yêu cầu nào
                this.currentConnection = null;
            }
            return;
        }

        this.isProcessing = true; // Đánh dấu bot đang xử lý
        const { text, channel, type } = this.queue.shift(); // Lấy yêu cầu đầu tiên từ hàng đợi

        // Kết nối tới kênh thoại
        if (!this.currentConnection || this.currentConnection.joinConfig.channelId !== channel.id) {
            if (this.currentConnection) {
                this.currentConnection.destroy(); // Ngắt kết nối kênh cũ nếu có
            }

            this.currentConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
        }

        const audioURL = googleTTS.getAudioUrl(text, {
            lang: 'vi',
            slow: false,
            host: 'https://translate.google.com',
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(audioURL);

        // Khi audio kết thúc, ngắt kết nối và xử lý yêu cầu tiếp theo trong hàng đợi
        player.on(AudioPlayerStatus.Idle, async () => {
            player.stop(); // Dừng phát audio
            if (this.queue.length === 0) {
                if (this.currentConnection) {
                    this.currentConnection.destroy(); // Ngắt kết nối sau khi hoàn thành
                    this.currentConnection = null;
                }
                this.isProcessing = false; // Đặt lại trạng thái xử lý
            } else {
                // Tiếp tục xử lý yêu cầu tiếp theo
                this.processQueue();
            }
        });

        player.play(resource);
        this.currentConnection.subscribe(player);
    }
}

module.exports = new VoiceQueue(); // Xuất một thể hiện của VoiceQueue
