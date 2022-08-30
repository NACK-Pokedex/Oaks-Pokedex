require('dotenv').config('.env');
const cors = require('cors')
const morgan = require('morgan');
const { auth } = require('express-openid-connect');
const app = require('./routes');
const { sequelize } = require('./db');
const express = require("express")
const appExpress = express()
const seedFunction = require('./db/seedFn')

const { User, Pokemon } = require('./db');
const dotenv = require("dotenv")
dotenv.config()
// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//destructure config environment, and import env variables

//IMPORT ENV VARS

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASEURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

//attach autho0 oidc auth router
appExpress.use(auth(config));

//user middleware

appExpress.get('/pokemons', async (req, res, next)=>{
  const user = req.oidc.user
  const pokemons = await Pokemon.findAll()
  const all = []

  for (let i = 0; i<pokemons.length; i++) {
    all.push({'name': pokemons[i].name, 'num':pokemons[i].num})

  }
  
  //map
  

  
  
  res.send(req.oidc.isAuthenticated() ? 
  //if
  all.map(poke =>`<h1>${poke.name}</h1><br><h2>${poke.num}</h2>`).join('')
  
  //else
  : 
  "You do not have access to this API, Please Login to try again.")
})

appExpress.get('/login', async (req, res) => {
  const user = req.oidc.user

  res.send(req.oidc.isAuthenticated() ? 
  "<h1>My PokeDex</h1>" +
  "<h2>Welcome " + user['name'] + "</h2>" +
  "<h3>Username: "+ user['nickname'] + "</h3>" + "<p>" + 
  user['email'] + "</p>" +
  "<h3>To logout please navigate to logout page</h3> "
  : console.log(AUTH0_CLIENTID),
  'You do not have access to this API, Please Login to try again.');
})

appExpress.get('/', async (req, res) => {
  const user = req.oidc.user

  res.send(req.oidc.isAuthenticated() ? 
  "<h1>Welcome to Pokedex</h1>" +
  "<h2>Welcome " + user['name'] + "</h2>" +
  "<h3>Username: "+ user['nickname'] + "</h3>" + "<p>" + 
  user['email'] + "</p>" +
  "<h3>To logout please navigate to logout page</h3> "
  : '<h1>Please login to view our Pokedex</h1>');
})
//create single 
appExpress.get('/:id', async (req, res) => {
  const pokemon = await Pokemon.findByPk(req.params.id)
  res.send(req.oidc.isAuthenticated() ? 
  "<h1>Pokemon Appears</h1>" +
  "<h2>Here is " + pokemon.name + "</h2>" +
  "<h3>Number: "+ pokemon.num + "</h3>" + 
  `<img src='http://www.serebii.net/pokemongo/pokemon/${pokemon.num}.png' >`+
  "<h3>To logout please navigate to logout page</h3>" 
  : 
  "You do not have access to this API, Please Login to try again."
  );
})


appExpress.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});
appExpress.listen(process.env.PORT, () => {
  //sequelize.sync({ force: false });
  seedFunction();

  console.log(`Pokedex is ready at http://localhost:${process.env.PORT}`);
});