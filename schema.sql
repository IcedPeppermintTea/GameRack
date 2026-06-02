-- tables necessary for the gamesrack.db database 

CREATE TABLE users (
id SERIAL PRIMARY KEY,
username TEXT UNIQUE NOT NULL,
password TEXT NOT NULL
);
CREATE TABLE games (
id SERIAL PRIMARY KEY,
rawg_id INTEGER UNIQUE,
title TEXT NOT NULL,
cover_url TEXT
);
CREATE TABLE library (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL,
game_id INTEGER NOT NULL,
state TEXT NOT NULL,
rating INTEGER,
review TEXT,
date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(user_id) REFERENCES users(id),
FOREIGN KEY(game_id) REFERENCES games(id)
);