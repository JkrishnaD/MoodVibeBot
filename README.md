# Mood Companion Bot

A friendly Telegram bot that helps you track your mood, suggests activities, and vibes with you using GIFs and Spotify playlists!

## Features

- **/start**: Get a welcome message and instructions.
- **/help**: List all available commands and how to use the bot.
- **/history**: View your last 10 logged moods.
- **/chart**: See a bar chart of your last 10 moods.
- **Mood Detection**: Send any message describing your mood (text or emoji) and the bot will detect it.
- **Mood Logging**: Your moods are stored for history and analytics.
- **Mood Suggestions**: Get activity suggestions tailored to your mood.
- **GIF Response**: Receive a fun GIF matching your mood.
- **Spotify Playlist**: Get a Spotify playlist recommendation for your current vibe.

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- A Telegram Bot API token ([How to get one](https://core.telegram.org/bots#6-botfather))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd mood-companion-bot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if provided) or create a `.env` file with:
     ```env
     TELEGRAM_BOT_API_KEY=your_telegram_bot_token
     # Add any other required API keys here
     ```
4. **Run the bot:**
   ```bash
   node index.js
   ```

## Usage

- Start a chat with your bot on Telegram.
- Use the following commands:
  - `/start` – Welcome and instructions
  - `/help` – List commands
  - `/history` – Show your last 10 moods
  - `/chart` – Bar chart of your last 10 moods
- Or just send a message describing your mood (e.g., "I'm feeling happy" or just an emoji like 😊).
- The bot will reply with your detected mood, a suggestion, a GIF, and a Spotify playlist.

## Project Structure

```
mood-companion-bot/
  services/         # Services for GIFs, music, and mood history
  utils/            # Utility functions (e.g., mood parsing)
  mood_history.json # Stores user mood logs
  index.js          # Main bot logic
  .env              # Environment variables
  package.json      # Project metadata and dependencies
```

## Contributing
Pull requests and suggestions are welcome! Feel free to open an issue or submit a PR.

## License
MIT 