const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '../mood_history.json');

function readHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

exports.logMood = (userId, mood) => {
  const history = readHistory();
  history.push({
    userId,
    mood,
    timestamp: new Date().toISOString(),
  });
  writeHistory(history);
};

exports.getUserHistory = (userId, limit = 10) => {
  const history = readHistory();
  return history
    .filter(entry => entry.userId === userId)
    .slice(-limit)
    .reverse();
}; 