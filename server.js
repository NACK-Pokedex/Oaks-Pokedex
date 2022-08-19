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

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//destructure config environment, and import env variables
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '234a9270a7dac977173475e261cb55af1d856b7f38cf1eb643a4c03c64cbab3d',
  baseURL: 'http://localhost:3000',
  clientID: 'N9ST43XWV4OpCI1k8hL4GQH2b9kpr1Lb',
  issuerBaseURL: 'https://dev-705c4znf.us.auth0.com'
};
//IMPORT ENV VARS
const {
  AUTH0_SECRET,
  AUTH0_BASEURL,
  AUTH0_CLIENTID,
  AUTH0_ISSUER_BASE_URL,
  PORT
} = process.env

//attach autho0 oidc auth router
appExpress.use(auth(config));

//user middleware

appExpress.get('/pokemons', async (req, res, next)=>{
  const user = req.oidc.user
  const pokemons = await Pokemon.findAll()
  console.log("Hi")
  res.send(req.oidc.isAuthenticated() ? 
  //if
  pokemons
  
  
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
  : 'You do not have access to this API, Please Login to try again.');
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





appExpress.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});
appExpress.listen(PORT, () => {
  //sequelize.sync({ force: false });
  seedFunction();

  console.log(`Pokedex is ready at http://localhost:${PORT}`);
});