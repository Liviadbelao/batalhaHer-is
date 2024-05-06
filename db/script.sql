CREATE DATABASE batalhaherois;


CREATE TABLE herois (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    power VARCHAR(100) NOT NULL,
    level INT NOT NULL, 
    hp INT NOT NULL,
    equipe VARCHAR(100),
    editora VARCHAR(100)
);