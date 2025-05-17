require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { getGif } = require("./services/gifServices");
const { getPlaylist } = require("./services/musicService");
const { extractMood } = require("./utils/moodParser");
const { logMood, getUserHistory } = require("./services/moodHistoryService");

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

bot.onText(/\/history/, (msg) => {
  const history = getUserHistory(msg.from.id, 10);
  if (history.length === 0) {
    bot.sendMessage(
      msg.chat.id,
      "No mood history found. Send me your mood to start your journal!"
    );
    return;
  }
  const historyText = history
    .map(
      (entry, idx) =>
        `${idx + 1}. *${entry.mood}* at _${new Date(
          entry.timestamp
        ).toLocaleString()}_`
    )
    .join("\n");
  bot.sendMessage(
    msg.chat.id,
    `Your last ${history.length} moods:\n${historyText}`,
    {
      parse_mode: "Markdown",
    }
  );
});

bot.onText(/\/chart/, async (msg) => {
  const history = getUserHistory(msg.from.id, 10);
  if (history.length === 0) {
    bot.sendMessage(
      msg.chat.id,
      "No mood history found. Send me your mood to start your journal!"
    );
    return;
  }
  // Prepare data for the bar chart
  const moods = ["happy", "sad", "angry", "chill", "motivated"];
  const moodCounts = moods.map(
    (mood) => history.filter((entry) => entry.mood === mood).length
  );

  // Chart config for QuickChart (bar chart)
  const chartConfig = {
    type: "bar",
    data: {
      labels: moods,
      datasets: [
        {
          label: "Mood Frequency (last 10 moods)",
          data: moodCounts,
          backgroundColor: [
            "rgba(255, 206, 86, 0.7)", // happy
            "rgba(54, 162, 235, 0.7)", // sad
            "rgba(255, 99, 132, 0.7)", // angry
            "rgba(75, 192, 192, 0.7)", // chill
            "rgba(153, 102, 255, 0.7)", // motivated
          ],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Your Mood Frequency (last 10 moods)",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Count",
          },
        },
        x: {
          title: {
            display: true,
            text: "Mood",
          },
        },
      },
    },
  };
  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(
    JSON.stringify(chartConfig)
  )}`;
  bot.sendPhoto(msg.chat.id, chartUrl, {
    caption: "Here is your mood bar chart (last 10 moods)!",
  });
});

bot.onText(/\/help/, (msg) => {
  const helpText = `🤖 *Mood Companion Bot Commands:*

/start - Start the bot and get a welcome message
/help - Show this help message
/history - Show your last 10 moods
/chart - Show a bar chart of your last 10 moods

Just send your mood (text or emoji) and I'll respond with a GIF and a Spotify playlist!`;
  bot.sendMessage(msg.chat.id, helpText, { parse_mode: "Markdown" });
});

bot.on("message", async (msg) => {
  // Ignore commands (they are handled separately)
  if (msg.text.startsWith("/")) return;

  console.log(msg);

  const mood = extractMood(msg.text);
  logMood(msg.from.id, mood);

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
