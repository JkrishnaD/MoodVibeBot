const axios = require("axios");

exports.getGif = async (mood) => {
  try {
    const res = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
      params: {
        api_key: process.env.GIPHY_API_KEY,
        q: mood,
        limit: 1,
      },
    });
    return res.data.data[0]?.images.original.url;
  } catch (err) {
    console.error("Giphy Error:", err.message);
    return null;
  }
};
