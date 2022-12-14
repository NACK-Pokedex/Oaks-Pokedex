require('dotenv').config('.env');
const cors = require('cors')
const morgan = require('morgan');
const { auth } = require('express-openid-connect');
const app = require('./routes');
const { sequelize } = require('./db');
const express = require("express")
const appExpress = express()
const seedFunction = require('./db/seedFn')

const authConfig = require("./auth-config.json");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");

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

if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}
// Need to fix the token, token is invalid
const authorizeAccessToken = jwt({
  secret: "super secret",
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
  
});
console.log(authorizeAccessToken);

const checkPermissions = jwtAuthz(["read:pokemon", "create:pokemon"], {
  customScopeKey: "permissions",
  checkAllScopes: true
});
//user middleware

appExpress.get('/pokemons', async (req, res, next)=> {
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

appExpress.get("/api/protected", authorizeAccessToken, (req, res) => {
  res.send({
    msg: "You called the protected endpoint!"
  });
});

appExpress.get("/api/role", authorizeAccessToken, checkPermissions, (req, res) => {
  res.send({
    msg: "You called the role endpoint!"
  })
});


appExpress.get('/users/:id', async (req, res) => {
  const userId = req.params.id
  const user = await User.findByPk(userId)
  res.send(user)
})

// appExpress.get('/login', async (req, res) => {
//   const user = req.oidc.user
// //if user is authenticated create user
// let admin = false
// if(user['email'].endsWith('@OakCorp.net')){
//   admin = True
// }
// //create a varaible that will equal to the the hashed password
// await User.Create({username: user['nickname'], name:user['name'],
// email:user['email'], isAdmin: admin, password: /*insert password variable*/})
//   res.send(req.oidc.isAuthenticated() ?
  
//   "<h1>My PokeDex</h1>" +
//   "<h2>Welcome " + user['name'] + "</h2>" +
//   "<h3>Username: "+ user['nickname'] + "</h3>" + "<p>" + 
//   user['email'] + "</p>" +
//   "<h3>To logout please navigate to logout page</h3> "
//   : console.log(AUTH0_CLIENTID),
//   'You do not have access to this API, Please Login to try again.');
// })

appExpress.get('/', async (req, res) => {
  const user = req.oidc.user

  res.send(req.oidc.isAuthenticated() ? 
  "<h1>Welcome to Pokedex</h1>" +
  // "<h2>Welcome " + user['name'] + "</h2>" +
  // "<h3>Username: "+ user['nickname'] + "</h3>" + "<p>" + 
  user['email'] + "</p>" +
  "<h3>To logout please navigate to logout page</h3> "
  : '<h1>Please login to view our Pokedex</h1>');
})
//create single 
appExpress.get('/:id', async (req, res) => {
  const pokemon = await Pokemon.findByPk(req.params.id);
  
  res.send(req.oidc.isAuthenticated() ?
  "<h1>Pokemon Appears</h1>" +
  "<h2>Here is " + pokemon.name + "</h2>" +
  "<h3>Number: "+ pokemon.num + "</h3>" + 
  `<img src='http://www.serebii.net/pokemongo/pokemon/${pokemon.num}.png' >`+
  "<form action='/pokemons'>" +
    "<input type='submit' value='See all Pokemon' />" +
  "</form>" + 
  "<form action='/newPokemon'>" +
      "<input type='submit' value='Add Pokemon' />" +
  "</form>" + 
  "<form action='/update'>" +
      "<input type='submit' value='Update Pokemon' />" +
  "</form>" + 
  "<form action='/delete'>" +
      "<input type='submit' value='Delete Pokemon' />" +
  "</form>" + 
  "<h3>To logout please navigate to logout page</h3>" 
  : 
  "You do not have access to this API, Please Login to try again."
  );
})

appExpress.put('/update', async (req, res) => {
  await Pokemon.update(req.body, {
      where : {id : req.params.id}
  });
  res.send(req.oidc.isAuthenticated() ?
  "<h1>Updated Pokemon</h1>"
  :
  "You do not have access to this API, Please Login to try again."
  );
})

appExpress.post('/newPokemon', async (req, res) => {
  await Pokemon.create(req.body)
  res.send(req.oidc.isAuthenticated() ?
  "<h1>Pokemon Created</h1>"
  :
  "You do not have access to this API, Please Login to try again."
  );
  
})

appExpress.delete('/delete', async (req, res) => {
  await Pokemon.destroy({
  where : {id : req.params.id}
});

res.send(req.oidc.isAuthenticated() ?
  "Pokemon Deleted"
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