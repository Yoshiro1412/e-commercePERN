const { username, password } = require('./credentials.json');
const pgp = require('pg-promise')();
const db = pgp(`postgres://${username}:${password}@localhost:5432/ecommerce`);

const express = require('express');
const app = express();
const port = 3000;

app.get('/', async (req,res) => {
    db.one('SELECT * FROM product')
    .then(data => {
        res.send(data);
    })
    .catch(error => {
        console.error('Error: '+ error);
    });
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})
