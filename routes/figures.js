const express = require('express');
const app = express.Router();

const figure = require('../controllers/figure');

app.get('/create', figure.figureCreateView);

app.post('/create', figure.figureCreate);

app.get('/:id/edit', figure.figureUpdateView);

app.post('/:id/edit', figure.figureUpdate);

app.get('/:id/delete', figure.figureDeletionView);

app.post('/:id/delete', figure.figureDelete);

app.get('/:id', figure.figureDetail);

app.get('/', figure.figureList)

module.exports = app;