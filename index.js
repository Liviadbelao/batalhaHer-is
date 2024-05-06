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
// rota de todos os herois

app.get('/herois', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM herois');
        res.json({
            total: resultado.rowCount,
            herois: resultado.rows,
        });
    } catch (error) {
        console.error('erro a obter todos os herois', error);
        res.status(500).send('erro ao obter os herois');
    }
});
app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}⚡`);
});