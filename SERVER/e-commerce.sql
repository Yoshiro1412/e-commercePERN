CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    user_password VARCHAR(60) NOT NULL,
    nick VARCHAR(50) NOT NULL
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES account(id)
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    product_description VARCHAR(300),
    price REAL NOT NULL
);

CREATE TABLE purchase (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    amount INT NOT NULL,
    FOREIGN KEY(cart_id) REFERENCES cart(id),
    FOREIGN KEY(product_id) REFERENCES product(id)
);