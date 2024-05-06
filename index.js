const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'batalhaherois',
    password: 'ds564',
    port: 7007,
});
app.use(express.json());

//rota de teste
app.get('/', (req, res) => {
    res.send('a rota esta funcionando');
});

app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}⚡`);
});