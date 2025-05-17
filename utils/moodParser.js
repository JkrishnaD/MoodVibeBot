const emoji = require('emoji-dictionary');

exports.extractMood = (text) => {
  const moods = ["happy", "sad", "angry", "chill", "motivated"];
  // Check for emoji meanings
  for (const char of text) {
    const name = emoji.getName(char);
    if (name) {
      // Map emoji name/keywords to your moods
      if (name.includes('smile')|| name.includes('Smiling')  || name.includes('grin') || name.includes('laugh') || name.includes('joy')) return 'happy';
      if (name.includes('cry') || name.includes('Pleading') || name.includes('sad') || name.includes('sob') || name.includes('frown')) return 'sad';
      if (name.includes('angry') || name.includes('rage') || name.includes('mad')) return 'angry';
      if (name.includes('cool') || name.includes('relaxed') || name.includes('sunglasses')) return 'chill';
      if (name.includes('muscle') || name.includes('fire') || name.includes('clap') || name.includes('trophy')) return 'motivated';
    }
  }
  // Fallback to word-based detection
  const lowerText = text.toLowerCase();
  for (const mood of moods) {
    if (lowerText.includes(mood)) {
      return mood;
    }
  }
  return "chill"; // Default fallback
};
