const express = require("express");
const router = express.Router();
const { Pokemon } = require("./db/Pokemon");

//GET/pokemons

router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll();
        res.send(pokemons);
      } catch (error) {
        next(error);
      }
})

router.get('/:id', async (req, res, next) => {
    let pokemon = await Pokemon.findByPk(req.params.id)
    res.json({pokemon});
})

router.post('/', async (req, res) => {
    let newPokemon = await Pokemon.create(req.body)
    res.json(newPokemon);
})

router.delete('/:id', async (req, res) => {
    await Pokemon.destroy({
		where : {id : req.params.id}
	});
	res.send('pokemon deleted!')
})

router.put('/:id', async (req, res) => {
    await Pokemon.update(req.body, {
        where : {id : req.params.id}
    });
    res.send("pokemon updated")
})



module.exports = router;