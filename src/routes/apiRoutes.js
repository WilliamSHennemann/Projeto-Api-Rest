const express = require('express');

const router = express.Router();

const status = (req, res) => {
  return res.json({
    versao: process.env.API_VERSION || '2.0.0',
    status: 'online'
  });
};

router.get('/status', status);
router.get('/versao', status);

module.exports = router;
