const express = require('express');
const app = express.Router();

const character = require('../controllers/character');

app.get('/', character.characterList);

app.get('/:id', character.characterDetail);

app.get('/create', character.characterCreateView);

app.post('/create', character.characterCreate);

app.get('/:id/edit', character.characterUpdateView);

app.put('/:id/edit', character.characterUpdate);

app.get('/:id/delete', character.characterDeletionView);

app.delete('/:id/delete', character.characterDelete);

module.exports = app;