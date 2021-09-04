const { username, password } = require('./credentials.json');
const pgp = require('pg-promise')();
const db = pgp(`postgres://${username}:${password}@localhost:5432/ecommerce`);

const bcrypt = require('bcrypt');
const saltRounds = 10;

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

/**
 * # Data needed #
 * Login GET
 * - nick
 * - password
 * Register POST
 * - name
 * - nick
 * - password
 * - email
 * Home GET
 * - product
 *  - name
 *  - price
 *  - stock
 * Product detail GET
 * - name
 * - description
 * - stock
 * CART
 * - product GET
 *  - name
 *  - stock
 * Sell button -> POST: product stock
 * 
 */

// --- Products ---

// Get all the products
app.get('/api/products', async (req,res) => {
    db.manyOrNone('SELECT * FROM product WHERE stock > 0 ORDER BY product_name')
    .then(data => {
        res.send(data);
    })
    .catch(error => {
        console.error('Error: '+error);
    });
});

// Get one product
app.get('/api/product/:id', async (req,res) => {
    db.one('SELECT * FROM product WHERE id = $1',req.params.id)
    .then(data => res.send(data))
    .catch(error => console.error('Error: '+error));
});

// Update stock
app.put('/api/product/:id', async (req,res) => {
    db.none('UPDATE product SET stock = $1 WHERE id = $2',[req.body.stock,req.params.id])
    .then(() => res.send('Updated'))
    .catch(error => console.error('Error: '+error));
})

// --- User ---

// Create user
app.post('/api/user', async (req,res) => {
    const { user_name,email,password,nick } = req.body;
    bcrypt.hash(password,saltRounds)
    .then(hash => {
        db.none(
            'INSERT INTO account (user_name,email,user_password,nick) VALUES ($1,$2,$3,$4)',
            [user_name,email,hash,nick]
        )
        .then(() => res.status(201).send('User added'))
        .catch(error => console.error('Error :'+error))
    })
    .catch(error => console.error('Error: '+error));
});

// Log user
app.get('/api/user/login', async (req,res) => {
    const { email,password } = req.body;
    const response = await db.oneOrNone('SELECT user_password FROM account WHERE email = $1',email);
    if (response==null) return res.send(false);
    const { user_password } = response;
    bcrypt.compare(password,user_password)
    .then(isSamePassword => res.send(isSamePassword))
    .catch(error => console.log('Error: '+error));
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
