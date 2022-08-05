const express = require("express");
const router = express.Router();

// different model routers
router.use('/pokemon', require('./routes'));


module.exports = router;