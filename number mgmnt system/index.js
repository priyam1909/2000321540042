const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URLs are required' });
  }

  try {
    const urls = Array.isArray(url) ? url : [url];
    const responses = await Promise.all(urls.map((url) => axios.get(url)));

    let mergedNumbers = [];
    for (const response of responses) {
      mergedNumbers = [...mergedNumbers, ...response.data.numbers];
    }

    const uniqueNumbers = Array.from(new Set(mergedNumbers));
    const sortedNumbers = uniqueNumbers.sort((a, b) => a - b);

    return res.json({ numbers: sortedNumbers });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve numbers' });
  }
});

app.listen(port, () => {
  console.log(`Number Management Service is running on port ${port}`);
});

