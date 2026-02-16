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

console.log('ПРО•ХИТ бот запущен!');

// --- Helpers ---

async function isAdmin(chatId, userId) {
  try {
    const member = await bot.getChatMember(chatId, userId);
    return ['creator', 'administrator'].includes(member.status);
  } catch {
    return false;
  }
}

async function sendPost(chatId, text) {
  await bot.sendMessage(chatId, text, { parse_mode: 'HTML', disable_web_page_preview: true });
}

async function sendTrackPost(chatId, trackData) {
  await sendPost(chatId, trackData.text);
  if (trackData.audioFile && fs.existsSync(trackData.audioFile)) {
    await bot.sendAudio(chatId, trackData.audioFile, {
      title: trackData.trackName,
      performer: 'ПРО•ХИТ Band'
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
        await sendPost(chatId, await generateFact());
        break;
      case 'poll':
        await sendPoll(chatId);
        break;
      case 'announce':
        await sendPost(chatId, await generateAnnounce());
        break;
    }
  } catch (err) {
    console.error('Ошибка автопоста:', err.message);
  }
}

// --- Commands ---

bot.onText(/\/help/, (msg) => {
  const text =
    '<b>ПРО•ХИТ Бот</b>\n\n' +
    '/post — сгенерировать пост (админ)\n' +
    '/track — трек дня\n' +
    '/poll — опрос\n' +
    '/help — список команд';
  bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
});

bot.onText(/\/post/, async (msg) => {
  if (!(await isAdmin(msg.chat.id, msg.from.id))) {
    bot.sendMessage(msg.chat.id, 'Эта команда только для админов.');
    return;
  }
  try {
    await bot.sendMessage(msg.chat.id, '⏳ Генерирую пост...');
    await publishDaily(msg.chat.id);
  } catch (err) {
    bot.sendMessage(msg.chat.id, 'Ошибка: ' + err.message);
  }
});

bot.onText(/\/track/, async (msg) => {
  try {
    await bot.sendMessage(msg.chat.id, '🎵 Выбираю трек...');
    const trackData = await generateTrackPost();
    await sendTrackPost(msg.chat.id, trackData);
  } catch (err) {
    bot.sendMessage(msg.chat.id, 'Ошибка: ' + err.message);
  }
});

bot.onText(/\/poll/, async (msg) => {
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
