exports.extractMood = (text) => {
  const moods = ["happy", "sad", "angry", "chill", "motivated"];
  const lowerText = text.toLowerCase();
  for (const mood of moods) {
    if (lowerText.includes(mood)) {
      return mood;
    }
  }
  return "chill"; // Default fallback
};
