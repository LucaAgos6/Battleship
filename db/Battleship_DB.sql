DROP DATABASE IF EXISTS Battleship;

CREATE DATABASE Battleship;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS leaderboard;

CREATE TABLE users(
    email VARCHAR(100) NOT NULL PRIMARY KEY,
    role VARCHAR(10) CHECK (role = 'user' OR role = 'admin'),
    token DECIMAL
);

CREATE TABLE game(
    id serial NOT NULL PRIMARY KEY,
    player1 VARCHAR(100),
    player2 VARCHAR(100),
    game_status VARCHAR(100) CHECK (game_status = 'in progress' OR game_status = 'closed'),
    player_turn VARCHAR(100) CHECK (player_turn = player1 OR player_turn = player2),
    winner VARCHAR(100) CHECK (player_turn = player1 OR player_turn = player2),
    loser VARCHAR(100) CHECK (player_turn = player1 OR player_turn = player2),
    grid_dim SMALLINT CHECK (grid_dim >= 5 AND grid_dim <= 20),
    grids JSON,
    log_moves JSON,
    game_date DATE
);

CREATE TABLE leaderboard(
    email VARCHAR(100) NOT NULL PRIMARY KEY,
    total_matches INT CHECK(total_matches >= 0),
    wins INT CHECK (wins >= 0),
    losses INT CHECK (losses >= 0),
    win_ratio REAL CHECK (win_ratio >= 0 AND win_ratio <= 1)
);

INSERT INTO users (email, role, token) VALUES
  ('admin@mail.it', 'admin', 50),
  ('user1@mail.it', 'user', 10),
  ('user2@mail.it', 'user', 10),
  ('user3@mail.it', 'user', 10),
  ('user4@mail.it', 'user', 10),
  ('user5@mail.it', 'user', 10),
  ('user6@mail.it', 'user', 0),
  ('AI', 'user', 0);