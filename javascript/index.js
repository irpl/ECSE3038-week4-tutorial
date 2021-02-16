const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("<db_connection_string>", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const PokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  p_type: {
    type: String,
    required: true,
  },
  health: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const Pokemon = mongoose.model("pokemon", PokemonSchema);

app.get("/pokemon", (req, res) => {
  Pokemon.find((err, pokemon) => {
    if (err) {
      throw err;
    }
    res.json(pokemon);
  });
});

app.post("/pokemon", (req, res) => {
  let newPokemon = new Pokemon({
    name: req.body.name,
    p_type: req.body.p_type,
    health: req.body.health,
    color: req.body.color,
  });

  newPokemon.save((err, pokemon) => {
    if (err) res.status(400).json("Bad Request");

    res.json(pokemon);
  });
});

app.patch("/pokemon/:id", (req, res) => {
  let id = req.params.id;
  let update = req.body;

  Pokemon.findOneAndUpdate({ _id: id }, update, { new: true }, (err, pokemon) => {
    if (err) res.status(400).json("Bad Request");

    res.json(pokemon);
  });
});

app.delete("/pokemon/:id", (req, res) => {
  let id = req.params.id;

  Pokemon.findOneAndDelete({ _id: id }, (err) => {
    if (err) res.status(400).json("Bad Request");
    res.json({
      success: true,
    });
  });
});

app.listen(5000);
