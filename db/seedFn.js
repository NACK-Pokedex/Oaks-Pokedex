const {sequelize} = require('./db')
const {Pokemon} = require('./')
const {pokemons} = require('./seedData')

const seed = async () => {
    await sequelize.sync({ force: true });
    await Pokemon.bulkCreate(pokemons);
  };

module.exports = seed;