const app = require('./routes');
const { sequelize } = require('./db');
const express = require("express")
const appExpress = express()
const { PORT = 3000 } = process.env;
const seedFunction = require('./db/seedFn')


appExpress.listen(PORT, () => {
  // sequelize.sync({ force: false });
  seedFunction();
  console.log(`Pokedex is ready at http://localhost:${PORT}`);
});