const express = require('express');
const app = express.Router();

const character = require('../controllers/character');

app.get('/characters', character.characterList)

module.exports = app;