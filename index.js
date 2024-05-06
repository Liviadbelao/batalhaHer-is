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


//função batalha de heróis
const batalha = async (heroi_1, heroi_2) => {
    try {
        const heroiQuery1 = await pool.query('SELECT * FROM herois WHERE id = $1', [heroi_1]);
        const heroiQuery2 = await pool.query('SELECT * FROM herois WHERE id = $1', [heroi_2]);

        const heroi1 = heroiQuery1.rows[0];
        const heroi2 = heroiQuery2.rows[0];

        let vencedor = null;
        if (heroi1.level > heroi2.level) {
            vencedor = heroi1;
        } else if (heroi1.level < heroi2.level) {
            vencedor = heroi2;
        } else{
           return "Empate"
        }

        return vencedor;
    } catch (error) {
        console.error('Erro ao realizar a batalha', error);
        throw error; // Lança o erro para ser tratado na chamada da função
    }
};



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
   if(!nome || !power || !level || !hp){
    res.status(401).send({ mensagem: 'os campos : nome, power, level e hp, devem ser preenchidos!' });

   } else if (nome.length < 3){
    res.status(401).send({ mensagem: 'o nome não pode ter menos que 3 letras' });
   }
    else if ( level < 0){
    res.status(401).send({ mensagem: 'o level não pode ser menor que 0' });
   }
    else if ( hp < 0){
    res.status(401).send({ mensagem: 'o hp não pode ser menor que 0' });
   }
     else{  await pool.query('INSERT INTO herois (nome, power, level, hp, equipe, editora) VALUES ($1, $2, $3, $4, $5, $6)', [nome, power, level, hp, equipe, editora]);
        res.status(201).send({ mensagem: 'heroi criado com sucesso' });
}
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

//editar heroi
app.put('/herois/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, power, level, hp, equipe, editora } = req.body;
  
        if(!nome || !power || !level || !hp){
            res.status(401).send({ mensagem: 'os campos : nome, power, level e hp, devem ser preenchidos!' });
        
           } else if (nome.length < 3){
            res.status(401).send({ mensagem: 'o nome não pode ter menos que 3 letras' });
           }
            else if ( level < 0){
            res.status(401).send({ mensagem: 'o level não pode ser menor que 0' });
           }
            else if ( hp < 0){
            res.status(401).send({ mensagem: 'o hp não pode ser menor que 0' });
           }
    
           else{
            await pool.query('UPDATE herois SET nome = $1, power = $2, level = $3, hp = $4, equipe = $5, editora = $6 WHERE id = $7', [nome, power, level, hp, equipe, editora, id]);
            res.status(200).send({ mensagem: 'heroi atualizado' });
           }
    } catch (error) {
        console.error('erro ao atualizar heroi', error);
        res.status(500).send('erro ao atualizar heroi');
    }
});

//Rota batalha 
app.get('/herois/:heroi_1/:heroi_2', async (req, res) => {
    try {
        const { heroi_1, heroi_2 } = req.params;

        const vencedor = await batalha(heroi_1, heroi_2);

        if (vencedor === "Empate") {
            res.status(200).send('A batalha terminou em empate!');
        } else if (vencedor) {
            res.status(200).send(`Vencedor da batalha é ${vencedor.nome}`);
        } else {
            res.status(404).send('Heróis não encontrados');
        }
    } catch (error) {
        console.error('Erro ao realizar a batalha', error);
        res.status(500).send('Erro ao realizar a batalha');
    }
});

app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}⚡`);
});