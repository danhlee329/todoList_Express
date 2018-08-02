"use strict";

const express = require('express');

const root = './';
const app = express();

app.get('*', (req, res) => {
    res.sendFile(`baseHomePage.html`, { root: root });
});

var port = 8080;

module.exports = app.listen(port, '0.0.0.0', () => console.log(`API running on :${port}`));