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
// rota criar heroi
app.post('/herois', async (req, res) => {
    try {
        const { nome, power, level, hp, equipe, editora } = req.body;

        await pool.query('INSERT INTO herois (nome, power, level, hp, equipe, editora) VALUES ($1, $2, $3, $4, $5, $6)', [nome, power, level, hp, equipe, editora]);
        res.status(201).send({ mensagem: 'heroi criado com sucesso' });
    }
    catch (error) {
        console.error('erro ao inserir heroi', error);
        res.status(500).send('erro ao inserir heroi');
    }
});

//deletar herois 
app.delete('/herois/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM herois WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'heroi deletado' });
    } catch (error) {
        console.error('erro ao excluir heroi', error);
        res.status(500).send('erro ao excluir heroi');
    }
});
app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}⚡`);
});