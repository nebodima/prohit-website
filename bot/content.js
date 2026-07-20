const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
const os = require('os');

const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const ELEVENLABS_VOICE_ID = 'gJEfHTTiifXEDmO687lC'; // Prince Nur — русский мужской голос

const BAND_CONTEXT = `Ты — AI-помощник кавер-группы 🎧 ПРО•ХИТ из Москвы (район Прокшино, Испанские кварталы).
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

const MUSIC_DIR = path.join(__dirname, '..', 'media', 'music');
const PHOTOS_DIR = path.join(__dirname, '..');

const TRACKS = [
  { name: 'The Weeknd — Save Your Tears', file: 'SaveYourTearsOfficial Music.mp3' },
  { name: 'Shawn Mendes, Camila Cabello — Senorita', file: 'senorita.mp3' },
  { name: 'Maroon 5 — Don\'t Wanna Know', file: 'Maroon - Don\'t Wanna Know.mp3' },
  { name: 'Maroon 5 — Girls Like You', file: 'Maroon 5 - Girls Like You ft. Cardi.mp3' },
  { name: 'Ayten Rasul — Kimleri Sevdik', file: 'Ayten Rasul Kimleri Sevdik.mp3' },
  { name: 'Miley Cyrus — Flowers', file: 'Miley Cyrus - Flowers Official Video.mp3' },
  { name: 'Ferhat Göçer & Aysegül Coskun — Yıllarım Gitti', file: 'FerhatGöçerAysegülCoskunYıllarımGitti.mp3' },
];

// Фото группы из репозитория
const BAND_PHOTOS = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','8.jpg'];

function getRandomTrack() {
  return TRACKS[Math.floor(Math.random() * TRACKS.length)];
}

function getRandomPhoto() {
  const file = BAND_PHOTOS[Math.floor(Math.random() * BAND_PHOTOS.length)];
  return path.join(PHOTOS_DIR, file);
}

const CONTENT_TYPES = ['track', 'fact', 'poll', 'announce'];

let contentIndex = 0;

async function askClaude(prompt) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: BAND_CONTEXT,
    messages: [{ role: 'user', content: prompt }]
  });
  return msg.content[0].text;
}

// Генерация картинки через Gemini Imagen
async function generateImage(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['image', 'text'] }
    });
    const response = result.response;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const tmpFile = path.join(os.tmpdir(), 'prohit_img_' + Date.now() + '.png');
        fs.writeFileSync(tmpFile, Buffer.from(part.inlineData.data, 'base64'));
        return tmpFile;
      }
    }
    return null;
  } catch (err) {
    console.error('Gemini image error:', err.message);
    return null;
  }
}

// Генерация голосового сообщения через ElevenLabs
async function generateVoice(text) {
  try {
    // Убираем HTML-теги для озвучки
    const cleanText = text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const audio = await elevenlabs.textToSpeech.convert(ELEVENLABS_VOICE_ID, {
      text: cleanText,
      modelId: 'eleven_multilingual_v2',
      voiceSettings: {
        stability: 0.3,
        similarityBoost: 0.8,
        style: 0.7,
        useSpeakerBoost: true
      }
    });
    const tmpFile = path.join(os.tmpdir(), 'prohit_voice_' + Date.now() + '.mp3');
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    fs.writeFileSync(tmpFile, Buffer.concat(chunks));
    return tmpFile;
  } catch (err) {
    console.error('ElevenLabs voice error:', err.message);
    return null;
  }
}

// Распознавание речи через ElevenLabs Scribe
async function transcribeAudio(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'audio/ogg' });
    const formData = new FormData();
    formData.append('file', blob, 'voice.ogg');
    formData.append('model_id', 'scribe_v1');
    formData.append('language_code', 'ru');

    const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
      body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.text || '';
  } catch (err) {
    console.error('Transcription error:', err.message);
    return null;
  }
}

// Диалог с Claude (с историей сообщений)
const chatHistories = new Map();

async function chatWithClaude(userId, userMessage) {
  if (!chatHistories.has(userId)) chatHistories.set(userId, []);
  const history = chatHistories.get(userId);
  history.push({ role: 'user', content: userMessage });
  // Держим последние 20 сообщений
  if (history.length > 20) history.splice(0, history.length - 20);

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: BAND_CONTEXT + '\n\nСейчас ты ведёшь живой диалог с пользователем. Отвечай коротко, дружелюбно, по-русски. Без HTML-тегов.',
    messages: history
  });
  const reply = msg.content[0].text;
  history.push({ role: 'assistant', content: reply });
  return reply;
}

// Получить картинку: сначала пробуем AI, если не вышло — фото из репозитория
async function getPostImage(imagePrompt) {
  const aiImage = await generateImage(imagePrompt);
  if (aiImage) return { file: aiImage, generated: true };
  return { file: getRandomPhoto(), generated: false };
}

async function generateTrackPost() {
  const track = getRandomTrack();
  const text = await askClaude(
    `Напиши пост "Трек дня" про песню: ${track.name}. ` +
    'Расскажи коротко интересный факт об этой песне или исполнителе. ' +
    'В конце добавь призыв прийти на выступление послушать живое исполнение.'
  );
  const image = await getPostImage(
    `Концертная сцена с яркими цветными огнями, живая группа выступает, энергичная атмосфера, неоновые розовые и тёмно-синие тона. Надпись: "${track.name}". Стиль музыкального постера, современный дизайн.`
  );
  return { text, audioFile: path.join(MUSIC_DIR, track.file), trackName: track.name, image };
}

async function generateFact() {
  const text = await askClaude(
    'Напиши короткий интересный пост — факт о живой музыке, кавер-группах или одном из жанров (POP/ROCK/DISCO/FUNK). ' +
    'Свяжи это с группой 🎧 ПРО•ХИТ. Сделай пост вовлекающим, задай вопрос читателям в конце.'
  );
  const image = await getPostImage(
    'Музыкальные инструменты на сцене: гитара, барабаны, микрофон, клавиши. Атмосферное освещение с розовым неоновым свечением. Настроение концертного зала.'
  );
  return { text, image };
}

async function generatePollData() {
  const raw = await askClaude(
    'Придумай опрос для подписчиков группы 🎧 ПРО•ХИТ. Тема — музыка, выступления, песни. ' +
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
  const text = await askClaude(
    'Напиши пост-анонс/напоминание о группе 🎧 ПРО•ХИТ. ' +
    'Можно написать про: поиск музыкантов, приглашение на репетицию, атмосферу выступлений, ' +
    'или просто мотивационный пост про музыку и драйв. ' +
    'В конце упомяни сайт про-хит.рф или предложи написать в группу.'
  );
  const image = await getPostImage(
    'Постер группы, ищущей музыкантов. Силуэты барабанщика, басиста, вокалиста, клавишника. Неоновый розовый на чёрном фоне. Современный дизайн флаера.'
  );
  return { text, image };
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
  getNextContentType,
  generateImage,
  generateVoice,
  transcribeAudio,
  chatWithClaude,
  getRandomPhoto
};
