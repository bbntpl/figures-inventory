const express = require('express');
const app = express.Router();

const character = require('../controllers/character');

app.get('/create', character.characterCreateView);

app.post('/create', character.characterCreate);

app.get('/:id/edit', character.characterUpdateView);

app.post('/:id/edit', character.characterUpdate);

app.get('/:id/delete', character.characterDeletionView);

app.post('/:id/delete', character.characterDelete);

app.get('/:id', character.characterDetail);

app.get('/', character.characterList);


module.exports = app;