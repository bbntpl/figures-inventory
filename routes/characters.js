const express = require('express');
const app = express.Router();

const character = require('../controllers/character');

app.get('/characters', character.characterList);

app.get('/characters/:id', character.characterDetail);

app.get('/characters/create', character.characterCreateView);

app.post('/characters/create', character.characterCreate);

app.get('/characters/:id/edit', character.characterUpdateView);

app.put('/characters/:id/edit', character.characterUpdate);

app.get('/characters/:id/delete', character.characterDeletionView);

app.delete('/characters/:id/delete', character.characterDelete);

module.exports = app;