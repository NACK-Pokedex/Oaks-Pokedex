const {sequelize} = require('./db')
const {Pokemon} = require('./pokemon')

const path = require('path')
const fs = require('fs').promises



const seed = async () => {
    await sequelize.sync({ force: true });
    //look for the seed data file
    const pokemonPath = path.join(__dirname, 'seedData.json')

  //find out what kind of data lives in the path
    const buffer = await fs.readFile(pokemonPath)

    //parsing JSON object into js object
    const {pokemons} = JSON.parse(String(buffer))

    // use .create to generate a row in our pokemon table

    const pokemonPromise = pokemons.map(pokemon => Pokemon.create(pokemon))

    await Promise.all(pokemonPromise)

    console.log('Pokemons have been seeded!')
};

module.exports = seed;