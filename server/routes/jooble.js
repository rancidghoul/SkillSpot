const express = require('express');
const router = express.Router();
const axios = require('axios');

// Replace with your Jooble API key
const JOOBLE_API_KEY = 'ba5421c6-08ce-46b3-b2af-0753e899f81c';

router.post('/search', async (req, res) => {
  try {
    const response = await axios.post(
      `https://jooble.org/api/${JOOBLE_API_KEY}`,
      req.body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Jooble', details: err.message });
  }
});

module.exports = router; 