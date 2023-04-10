const express = require('express');
const app = express.Router();

const figure = require('../controllers/figure');

app.get('/figures', figure.figureList)

app.get('/figures/:id', figure.figureDetail);

app.get('/figures/create', figure.figureCreateView);

app.post('/figures/create', figure.figureCreate);

app.get('/figures/:id/edit', figure.figureUpdateView);

app.put('/figures/:id/edit', figure.figureUpdate);

app.get('/figures/:id/delete', figure.figureDeletionView);

app.delete('/figures/:id/delete', figure.figureDelete);

module.exports = app;