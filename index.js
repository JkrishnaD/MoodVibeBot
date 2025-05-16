require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { getGif } = require("./services/gifServices");
const { getPlaylist } = require("./services/musicService");
const { extractMood } = require("./utils/moodParser");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_KEY, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 Hey ${msg.from.first_name}!  
Send me your mood (like "I'm feeling happy") and I'll vibe with you.`
  );
});

bot.on("message", async (msg) => {
  console.log(msg);
  if (msg.text.startsWith("/")) {
    bot.sendMessage(
      msg.chat.id,
      "Invalid command try to add your mood in the message"
    );
    return;
  }

  const mood = extractMood(msg.text);

  bot.sendMessage(msg.chat.id, `Detected mood: *${mood}* 🎭`, {
    parse_mode: "Markdown",
  });

  try {
    const gif = await getGif(mood);
    const playlist = await getPlaylist(mood);

    if (gif) bot.sendAnimation(msg.chat.id, gif);
    if (playlist)
      bot.sendMessage(
        msg.chat.id,
        `🎧 Spotify Playlist for your vibe:\n${playlist}`
      );
  } catch (err) {
    console.error("Bot Error:", err.message);
    bot.sendMessage(
      msg.chat.id,
      "Oops! Something went wrong while vibing. Try again later."
    );
  }
});
