"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes')

const root = './';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(root));

// TODO: add cors support

app.use('/api', routes );

app.get('/', (req, res) => {
    res.sendFile(`baseHomePage.html`, { root: root });
});

app.get('*', (req, res) => {
    res.status(404).json("not found")
});

var port = 8080;

module.exports = app.listen(port, '0.0.0.0', () => console.log(`API running on :${port}`));