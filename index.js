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
            let perdedor = null;
    
            if (heroi1.level > heroi2.level) {
                vencedor = heroi1.id;
                perdedor = heroi2.id;
            } else if (heroi1.level < heroi2.level) {
                vencedor = heroi2.id;
                perdedor = heroi1.id;
            } else {
                if (heroi1.hp > heroi2.hp) {
                    vencedor = heroi1.id;
                    perdedor = heroi2.id;
                } else if (heroi1.hp < heroi2.hp) {
                    vencedor = heroi2.id;
                    perdedor = heroi1.id;
                } else {
                    return "Empate total"; 
                }
            }
    
            // Registrar a batalha no histórico
            await pool.query('INSERT INTO historicoBatalhas (heroi_1, heroi_2, vencedor, perdedor) VALUES ($1, $2, $3, $4)', [heroi_1, heroi_2, vencedor, perdedor]);
    
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
// Rota para obter o histórico de batalhas
app.get('/historico', async (req, res) => {
    try {
        const historico = await pool.query('SELECT hb.id, h1.nome AS nome_heroi_1, h2.nome AS nome_heroi_2, hv.nome AS nome_vencedor, hp.nome AS nome_perdedor FROM historicoBatalhas hb INNER JOIN herois h1 ON hb.heroi_1 = h1.id INNER JOIN herois h2 ON hb.heroi_2 = h2.id INNER JOIN herois hv ON hb.vencedor = hv.id INNER JOIN herois hp ON hb.perdedor = hp.id');

        res.status(200).json({
            total: historico.rowCount,
            historico: historico.rows,
        });
    } catch (error) {
        console.error('Erro ao obter o histórico de batalhas', error);
        res.status(500).send('Erro ao obter o histórico de batalhas');
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

        if (vencedor === "Empate total") {
            res.status(200).send('A batalha terminou em empate total!');
        } else if (vencedor) {

            const winnerInfo = await pool.query('SELECT * FROM herois WHERE id = $1', [vencedor]);

            if (winnerInfo.rowCount === 0) {
                res.status(404).send('Informações do vencedor não encontradas');
            } else {
                const { nome, level, hp } = winnerInfo.rows[0];

                res.status(200).json({
                    resultado: {
                        id: vencedor,
                        nome_heroi_1: heroi_1,
                        nome_heroi_2: heroi_2,
                        nome_vencedor: nome,
                        vencedorLevel: level,
                        vencedorHp: hp
                    }
                });
            }
        } else {
            res.status(404).send('Heróis não encontrados');
        }
    } catch (error) {
        console.error('Erro ao realizar a batalha', error);
        res.status(500).send('Erro ao realizar a batalha');
    }
});


//pegar batalha por nome de heroi
app.get('/batalha/nomeHeroi/:nome', async (req, res) => {
    try {
        const { nome } = req.params;

        const nomePesquisa = `%${nome}%`;
        const resultado = await pool.query('SELECT hb.id, h1.nome AS nome_heroi_1, h2.nome AS nome_heroi_2, hv.nome AS nome_vencedor, hp.nome AS nome_perdedor FROM historicoBatalhas hb INNER JOIN herois h1 ON hb.heroi_1 = h1.id INNER JOIN herois h2 ON hb.heroi_2 = h2.id INNER JOIN herois hv ON hb.vencedor = hv.id INNER JOIN herois hp ON hb.perdedor = hp.id   WHERE LOWER(h1.nome) LIKE LOWER($1) OR LOWER(h2.nome) LIKE LOWER($1) OR LOWER(hv.nome) LIKE LOWER($1) OR LOWER(hp.nome) LIKE LOWER($1)', [`%${nomePesquisa}%`]);
        if (resultado.rowCount == 0) {
            res.status(404).send('nome não encontrado');
        } else {
            res.json({

                total: resultado.rowCount,
                bruxo: resultado.rows
            });
        }
    } catch (error) {
        console.error('Erro ao pesquisar herois pelo nome', error);
        res.status(500).send('Erro ao pesquisar herois pelo nome');
    }
});
//pegar heroi por nome 
app.get('/herois/:nome', async (req, res) => {
    try {
        const { nome } = req.params;

        const nomePesquisa = `%${nome}%`;
        const resultado = await pool.query('SELECT * FROM herois WHERE LOWER(nome) LIKE LOWER($1)', [nomePesquisa]);
        if (resultado.rowCount == 0) {
            res.status(404).send('nome não encontrado');
        } else {
            res.json({
                total: resultado.rowCount,
                heroi: resultado.rows
            });
        }
    } catch (error) {
        console.error('Erro ao pesquisar heori pelo nome', error);
        res.status(500).send('Erro ao pesquisar heori pelo nome');
    }
});
app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}⚡`);
});