const {sequelize} = require('./db');
const {Pokemon} = require('./pokemon');
const { pokemon } = require('./seedData');

const seed = async () => {
  await sequelize.sync({ force: true });
  await Pokemon.bulkCreate(pokemon);
};

seed()
  .then(() => {
    console.log('Seeding success');
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    sequelize.close();
  });