const {Pokemon} = require('./Pokemon')
const {User} = require('./User')
const {sequelize, Sequelize} = require('./db')

User.hasMany(Pokemon)
//Scientist Id will let us know which scientist added the pokemon
Pokemon.belongsTo(User, {foreignKey: 'scientistId'})

module.exports = {
    Pokemon,
    User,
    sequelize,
    Sequelize
};