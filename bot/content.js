const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

const BAND_CONTEXT = `Ты — AI-помощник кавер-группы ПРО•ХИТ из Москвы (район Прокшино, Испанские кварталы).
Группа играет живую музыку в клубах и ресторанах.
Жанры: POP, ROCK, DISCO, FUNK.
Сайт: про-хит.рф
Telegram-группа: @prohit_group

Репертуар группы:
- The Weeknd — Save Your Tears
- Shawn Mendes, Camila Cabello — Senorita
- Maroon 5 — Don't Wanna Know
- Maroon 5 — Girls Like You
- Ayten Rasul — Kimleri Sevdik
- Miley Cyrus — Flowers
- Ferhat Göçer & Aysegül Coskun — Yıllarım Gitti
- и другие хиты разных лет

Репетиционная база: Rondo Music Studio (rondomusicstudio.ru).
Группа ищет музыкантов: барабанщик, бас-гитарист, вокалист, клавишник.

Пиши посты на русском языке. Используй эмодзи. Формат — Telegram HTML (теги <b>, <i>, <a href="">).
Посты должны быть короткими (3-6 строк), живыми и дружелюбными.`;

const path = require('path');

const MUSIC_DIR = path.join(__dirname, '..', 'media', 'music');

const TRACKS = [
  { name: 'The Weeknd — Save Your Tears', file: 'SaveYourTearsOfficial Music.mp3' },
  { name: 'Shawn Mendes, Camila Cabello — Senorita', file: 'senorita.mp3' },
  { name: 'Maroon 5 — Don\'t Wanna Know', file: 'Maroon - Don\'t Wanna Know.mp3' },
  { name: 'Maroon 5 — Girls Like You', file: 'Maroon 5 - Girls Like You ft. Cardi.mp3' },
  { name: 'Ayten Rasul — Kimleri Sevdik', file: 'Ayten Rasul Kimleri Sevdik.mp3' },
  { name: 'Miley Cyrus — Flowers', file: 'Miley Cyrus - Flowers Official Video.mp3' },
  { name: 'Ferhat Göçer & Aysegül Coskun — Yıllarım Gitti', file: 'FerhatGöçerAysegülCoskunYıllarımGitti.mp3' },
];

function getRandomTrack() {
  return TRACKS[Math.floor(Math.random() * TRACKS.length)];
}

const CONTENT_TYPES = ['track', 'fact', 'poll', 'announce'];

let contentIndex = 0;

async function askClaude(prompt) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: BAND_CONTEXT,
    messages: [{ role: 'user', content: prompt }]
  });
  return msg.content[0].text;
}

async function generateTrackPost() {
  const track = getRandomTrack();
  const text = await askClaude(
    `Напиши пост "Трек дня" про песню: ${track.name}. ` +
    'Расскажи коротко интересный факт об этой песне или исполнителе. ' +
    'В конце добавь призыв прийти на выступление послушать живое исполнение.'
  );
  return { text, audioFile: path.join(MUSIC_DIR, track.file), trackName: track.name };
}

async function generateFact() {
  return askClaude(
    'Напиши короткий интересный пост — факт о живой музыке, кавер-группах или одном из жанров (POP/ROCK/DISCO/FUNK). ' +
    'Свяжи это с группой ПРО•ХИТ. Сделай пост вовлекающим, задай вопрос читателям в конце.'
  );
}

async function generatePollData() {
  const raw = await askClaude(
    'Придумай опрос для подписчиков группы ПРО•ХИТ. Тема — музыка, выступления, песни. ' +
    'Ответь строго в формате JSON: {"question": "текст вопроса", "options": ["вариант1", "вариант2", "вариант3", "вариант4"]}. ' +
    'Только JSON, без пояснений.'
  );
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}

async function generateAnnounce() {
  return askClaude(
    'Напиши пост-анонс/напоминание о группе ПРО•ХИТ. ' +
    'Можно написать про: поиск музыкантов, приглашение на репетицию, атмосферу выступлений, ' +
    'или просто мотивационный пост про музыку и драйв. ' +
    'В конце упомяни сайт про-хит.рф или предложи написать в группу.'
  );
}

function getNextContentType() {
  const type = CONTENT_TYPES[contentIndex % CONTENT_TYPES.length];
  contentIndex++;
  return type;
}

module.exports = {
  generateTrackPost,
  generateFact,
  generatePollData,
  generateAnnounce,
  getNextContentType
};
