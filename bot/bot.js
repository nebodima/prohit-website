require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const fs = require('fs');
const {
  generateTrackPost,
  generateFact,
  generatePollData,
  generateAnnounce,
  getNextContentType
} = require('./content');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const OWNER_USERNAME = 'nebodima'; // только владелец может управлять ботом

console.log('🎧 ПРО•ХИТ бот запущен!');

// --- Helpers ---

function isOwner(msg) {
  return msg.from && msg.from.username === OWNER_USERNAME;
}

async function sendPost(chatId, text) {
  await bot.sendMessage(chatId, text, { parse_mode: 'HTML', disable_web_page_preview: true });
}

async function sendPhotoPost(chatId, data) {
  // Отправить картинку с подписью (caption)
  if (data.image && data.image.file && fs.existsSync(data.image.file)) {
    // Telegram caption ограничен 1024 символами
    var caption = data.text;
    if (caption.length > 1024) {
      // Отправим фото отдельно, текст отдельно
      await bot.sendPhoto(chatId, data.image.file);
      await sendPost(chatId, data.text);
    } else {
      await bot.sendPhoto(chatId, data.image.file, { caption: data.text, parse_mode: 'HTML' });
    }
    // Удалить временный AI-файл
    if (data.image.generated) {
      try { fs.unlinkSync(data.image.file); } catch(e) {}
    }
  } else {
    await sendPost(chatId, data.text);
  }
}

async function sendTrackPost(chatId, trackData) {
  await sendPhotoPost(chatId, trackData);
  if (trackData.audioFile && fs.existsSync(trackData.audioFile)) {
    await bot.sendAudio(chatId, trackData.audioFile, {
      title: trackData.trackName,
      performer: '🎧 ПРО•ХИТ Band'
    });
  }
}

async function sendPoll(chatId) {
  const data = await generatePollData();
  if (!data) {
    await bot.sendMessage(chatId, 'Не удалось создать опрос, попробуй ещё раз.');
    return;
  }
  await bot.sendPoll(chatId, data.question, data.options, { is_anonymous: false });
}

async function publishDaily(chatId) {
  const type = getNextContentType();
  console.log(`[${new Date().toLocaleString('ru')}] Автопост: ${type}`);
  try {
    switch (type) {
      case 'track':
        await sendTrackPost(chatId, await generateTrackPost());
        break;
      case 'fact':
        await sendPhotoPost(chatId, await generateFact());
        break;
      case 'poll':
        await sendPoll(chatId);
        break;
      case 'announce':
        await sendPhotoPost(chatId, await generateAnnounce());
        break;
    }
  } catch (err) {
    console.error('Ошибка автопоста:', err.message);
  }
}

// --- Commands (только для владельца @nebodima) ---

bot.onText(/\/help/, (msg) => {
  if (!isOwner(msg)) return;
  const text =
    '<b>🎧 ПРО•ХИТ Бот</b>\n\n' +
    '/post — сгенерировать пост\n' +
    '/track — трек дня с аудио\n' +
    '/poll — опрос\n' +
    '/help — список команд\n\n' +
    '<i>Команды доступны только владельцу.</i>';
  bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
});

bot.onText(/\/post/, async (msg) => {
  if (!isOwner(msg)) return;
  try {
    await bot.sendMessage(msg.chat.id, '⏳ Генерирую пост...');
    await publishDaily(msg.chat.id);
  } catch (err) {
    bot.sendMessage(msg.chat.id, 'Ошибка: ' + err.message);
  }
});

bot.onText(/\/track/, async (msg) => {
  if (!isOwner(msg)) return;
  try {
    await bot.sendMessage(msg.chat.id, '🎵 Выбираю трек...');
    const trackData = await generateTrackPost();
    await sendTrackPost(msg.chat.id, trackData);
  } catch (err) {
    bot.sendMessage(msg.chat.id, 'Ошибка: ' + err.message);
  }
});

bot.onText(/\/poll/, async (msg) => {
  if (!isOwner(msg)) return;
  try {
    await bot.sendMessage(msg.chat.id, '📊 Создаю опрос...');
    await sendPoll(msg.chat.id);
  } catch (err) {
    bot.sendMessage(msg.chat.id, 'Ошибка: ' + err.message);
  }
});

// --- Cron: daily post at 12:00 Moscow time ---
cron.schedule('0 12 * * *', () => {
  publishDaily(CHAT_ID);
}, { timezone: 'Europe/Moscow' });

console.log('Автопостинг: ежедневно в 12:00 МСК');
console.log(`Целевой чат: ${CHAT_ID}`);
console.log(`Владелец: @${OWNER_USERNAME}`);
