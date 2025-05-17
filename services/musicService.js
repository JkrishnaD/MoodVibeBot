const axios = require("axios");

const getSpotifyToken = async () => {
  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    }
  );
  return res.data.access_token;
};

exports.getPlaylist = async (mood) => {
  try {
    const token = await getSpotifyToken();
    const res = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: mood,
        type: "playlist",
        limit: 10,
      },
    });
    const items = res.data.playlists.items;
    if (items.length === 0) return null;

    // Filter out any null or incomplete items
    const validItems = items.filter(item => item && item.external_urls && item.external_urls.spotify);
    if (validItems.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * validItems.length);
    return validItems[randomIndex].external_urls.spotify;
  } catch (err) {
    console.error("Spotify Error:", err.message);
    return null;
  }
};
