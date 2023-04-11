const express = require('express');
const app = express.Router();

const figure = require('../controllers/figure');

app.get('/', figure.figureList)

app.get('/:id', figure.figureDetail);

app.get('/create', figure.figureCreateView);

app.post('/create', figure.figureCreate);

app.get('/:id/edit', figure.figureUpdateView);

app.put('/:id/edit', figure.figureUpdate);

app.get('/:id/delete', figure.figureDeletionView);

app.delete('/:id/delete', figure.figureDelete);

module.exports = app;