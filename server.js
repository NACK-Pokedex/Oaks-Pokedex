const app = require('./index');
const { sequelize } = require('./db');

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  sequelize.sync({ force: false });
  console.log(`Pokedex is ready at http://localhost:${PORT}`);
});