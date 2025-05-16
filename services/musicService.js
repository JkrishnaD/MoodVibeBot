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
        limit: 1,
      },
    });
    return res.data.playlists.items[0]?.external_urls.spotify;
  } catch (err) {
    console.error("Spotify Error:", err.message);
    return null;
  }
};
