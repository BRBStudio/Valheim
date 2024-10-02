/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    nút tại ActionRowBuilder.js ( định nghĩa nút sau )
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const translate = require('@iamtraction/google-translate');
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');
const translationCollector = new Map();
const translationEvents = {};

    // Hàm chuyển đổi mã ngôn ngữ thành tên ngôn ngữ
    function getLanguageName(isoCode) {
            const languages = {
            auto: "Tự động",
            as: "Tiếng Assam",
            af: "Tiếng Afrikaans",
            sq: "Tiếng Albania",
            am: "Tiếng Amharic",
            ar: "Tiếng Ả Rập",
            hy: "Tiếng Armenia",
            az: "Tiếng Azerbaijan",
            eu: "Tiếng Basque",
            be: "Tiếng Belarus",
            bn: "Tiếng Bengali",
            bs: "Tiếng Bosnia",
            bg: "Tiếng Bungari",
            ca: "Tiếng Catalan",
            ceb: "Cebuano",
            ny: "Chichewa",
            "zh-cn": "Tiếng Trung giản thể",
            "zh-tw": "Truyền thống Trung Hoa",
            co: "Tiếng Corse",
            hr: "Tiếng Croatia",
            cs: "Tiếng Séc",
            da: "Tiếng Đan Mạch",
            nl: "Tiếng Hà Lan",
            en: "Tiếng Anh",
            eo: "Quốc tế ngữ",
            et: "Tiếng Estonia",
            tl: "Tiếng Philippin",
            fi: "Tiếng Phần Lan",
            fr: "Người Pháp",
            fy: "Frisian(Tiếng Frisia)",
            gl: "Galician(Tiếng Galicia)",
            ka: "Georgian(Tiếng Gruzia)",
            de: "German(Tiếng Đức)",
            el: "Greek(Tiếng Hy Lạp)", 
            ht: "Haitian Creole(Tiếng Creole Haiti)",
            ha: "Hausa(Tiếng Hausa)",
            haw: "Hawaiian(Tiếng Hawaii)",
            iw: "Hebrew(Tiếng Do Thái)",
            hi: "Hindi(Tiếng Hindi)",
            hmn: "Hmong(Tiếng người Mông)",
            hu: "Hungarian(Tiếng Hungary)",
            is: "Icelandic(Tiếng Iceland)",
            ig: "Igbo(Tiếng Igbo)",
            id: "Indonesian(Tiếng Indonesia)",
            ga: "Irish(Tiếng Ireland)",
            it: "Italian",
            ja: "Japanese",
            jw: "Javanese",
            kn: "Kannada",
            kk: "Kazakh",
            km: "Khmer",
            ko: "Korean(Tiếng Hàn Quốc)",
            ku: "Kurdish (Kurmanji)",
            ky: "Kyrgyz",
            lo: "Lao",
            la: "Latin",
            lv: "Latvian",
            lt: "Lithuanian",
            lb: "Luxembourgish",
            mk: "Macedonian",
            mg: "Malagasy",
            ms: "Malay",
            ay: "Tiếng Aymara",
            ml: "Malayalam",
            mt: "Maltese",
            mi: "Maori",
            mr: "Marathi",
            mn: "Mongolian",
            my: "Myanmar (Burmese)",
            ne: "Nepali",
            no: "Norwegian",
            ps: "Pashto",
            fa: "Persian",
            pl: "Polish",
            pt: "Bồ Đào Nha",
            pa: "Punjabi",
            ro: "Romanian",
            ru: "Tiếng Nga",
            sm: "Samoan",
            gd: "Scots Gaelic",
            sr: "Serbian",
            st: "Sesotho",
            sn: "Shona",
            sd: "Sindhi",
            si: "Sinhala",
            sk: "Slovak",
            sl: "Slovenian",
            so: "Somali",
            es: "Spanish",
            su: "Sundanese",
            sw: "Swahili",
            sv: "Swedish",
            tg: "Tajik",
            ta: "Tamil",
            te: "Telugu",
            th: "Thai(Tiếng Thái Lan)",
            tr: "Turkish(Tiếng Thổ Nhĩ Kỳ)",
            uk: "Ukrainian",
            ur: "Urdu",
            uz: "Uzbek",
            vi: "Vietnamese",
            cy: "Welsh",
            xh: "Xhosa",
            yi: "Yiddish",
            yo: "Yoruba",
            zu: "Tiếng Zulu",
            };

            return languages[isoCode] || isoCode;
        }

        // Chức năng phát hiện ngôn ngữ: Hàm không đồng bộ detectLanguagesử dụng google-translatethư viện để phát hiện ngôn ngữ của một văn bản nhất định.
        async function detectLanguage(text) {
            try {
                const result = await translate(text, { to: 'en' });
                return result.from.language.iso;
            } catch (error) {
                return null;
            }
        }

        module.exports = {
            id: 'translate_tienganh',
            async execute(interaction, client) {
                // Lưu trữ sự kiện dịch cho người dùng
                translationEvents[interaction.user.id] = { type: 'translate_tienganh', from: 'vi', to: 'en' };
                await interaction.deferReply({ ephemeral: true });
                setupTranslateMessageCollector(interaction, 'vi', 'en');
            },
            // Export hai biến translationCollector và translationEvents
            translationCollector,
            translationEvents
        };
        
        // Hàm thiết lập bộ thu thập tin nhắn để dịch
        async function setupTranslateMessageCollector(interaction, fromLanguage, toLanguage, client) {
            try {
                const userTranslationEvent = translationEvents[interaction.user.id];
        
                if (!userTranslationEvent) {
                    throw new Error('Không tìm thấy sự kiện dịch cho người dùng.');
                }
        
                // Kiểm tra nếu đã có bộ thu thập cho người dùng này
                if (translationCollector.has(interaction.user.id)) {
                    return;
                }
        
                // Tạo bộ lọc để chỉ thu thập tin nhắn từ người dùng đã tương tác
                const filterCollect = (msg) => msg.author.id === interaction.user.id;  
        
                // Tạo bộ thu thập tin nhắn
                const TranslationCollectorInstance = interaction.channel.createMessageCollector({ filter: filterCollect });
        
                let lastMessageTimestamp = 0;
        
                TranslationCollectorInstance.on('collect', async (msg) => {
                    try {
                        if (msg.createdTimestamp > lastMessageTimestamp) {
                            lastMessageTimestamp = msg.createdTimestamp;
        
                            const userTranslationEvent = translationEvents[interaction.user.id];
                            const messageLanguage = await detectLanguage(msg.content);
        
                            if (userTranslationEvent.type === 'translate_tienganh' && messageLanguage !== userTranslationEvent.to) {
                                const translation = await translate(msg.content, { to: userTranslationEvent.to });
                                const translatedMessage = translation.text;
        
                                const embed = new EmbedBuilder()
                                    .setColor(config.embedCyan)
                                    .setTitle("🌐 Dịch tin nhắn")
                                    .setDescription(`***${msg.author.username} ĐÃ VIẾT***:\n\`\`\`diff\n-${msg.content}\`\`\`\n\nDịch ${getLanguageName(messageLanguage)} -> ${getLanguageName(userTranslationEvent.to)}:\n\`\`\`diff\n+${translatedMessage}\`\`\``)
                                    .setTimestamp()
                                    .setFooter({ text: `Chúc bạn 1 ngày tốt lành tại ***${interaction.guild.name}***` });
        
                                await interaction.followUp({
                                    embeds: [embed],
                                    ephemeral: true,
                                });
                            }
                        }
                    } catch (error) {
                        interactionError.execute(interaction, error, client);
                    }
                });
        
                TranslationCollectorInstance.on('end', () => {
                    translationCollector.delete(interaction.user.id);
                    delete translationEvents[interaction.user.id];
                });
        
                // Lưu trữ bộ thu thập vào Map
                translationCollector.set(interaction.user.id, TranslationCollectorInstance);
            } catch (error) {
                interactionError.execute(interaction, error, client);
            }
        }