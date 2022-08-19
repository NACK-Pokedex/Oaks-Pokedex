const {sequelize} = require('./db')
const {Pokemon, User} = require('./index')


const path = require('path')
const fs = require('fs').promises



const seed = async () => {
    await sequelize.sync({ force: true });
    //look for the seed data file
    const pokemonPath = path.join(__dirname, 'seedData.json')
    const userPath = path.join(__dirname, 'seedUsers.json')

  //find out what kind of data lives in the path
    const buffer = await fs.readFile(pokemonPath)
    const buffer2 = await fs.readFile(userPath)

    //parsing JSON object into js object
    const {pokemons} = JSON.parse(String(buffer))
    const {users} = JSON.parse(String(buffer2))

    // use .create to generate a row in our pokemon table

    const pokemonPromise = pokemons.map(pokemon => Pokemon.create(pokemon))
    const userPromise = users.map(user => User.create(user))

    await Promise.all(pokemonPromise)
    await Promise.all(userPromise)
    console.log('Pokemons and users have been seeded!')
};

module.exports = seed;