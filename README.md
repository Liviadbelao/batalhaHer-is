# Sistema de Batalha de Heróis

Este projeto consiste em um sistema de batalha entre heróis, onde é possível criar, listar, editar, deletar heróis e realizar batalhas entre eles, registrando o histórico de cada confronto.

## Funcionalidades Principais

### Listar Todos os Heróis

- **Endpoint:** `GET /herois`
- **Descrição:** Retorna todos os heróis cadastrados no sistema.
- **Resposta:**
  ```json
  {
    "total": 2,
    "herois": [
      {
        "id": 1,
        "nome": "Superman",
        "power": "Voar",
        "level": 10,
        "hp": 100,
        "equipe": "Liga da Justiça",
        "editora": "DC Comics"
      },
      {
        "id": 2,
        "nome": "Homem de Ferro",
        "power": "Tecnologia Avançada",
        "level": 8,
        "hp": 90,
        "equipe": "Vingadores",
        "editora": "Marvel"
      }
    ]
  }
### Criar Herói

- **Endpoint:** `POST /herois`
- **Descrição:** Cria um novo herói com os dados fornecidos no corpo da requisição.
- **Corpo da Requisição:**
  ```json
  {
    "nome": "Batman",
    "power": "Luta",
    "level": 9,
    "hp": 95,
    "equipe": "Liga da Justiça",
    "editora": "DC Comics"
  }
### Editar Herói

- **Endpoint:** `PUT /herois/:id`
- **Descrição:** Atualiza os dados de um herói específico.
- **Parâmetros da Requisição:**
  - `id`: ID do herói a ser editado.
- **Corpo da Requisição:**
  ```json
  {
    "nome": "Batman",
    "power": "Luta",
    "level": 10,
    "hp": 100,
    "equipe": "Liga da Justiça",
    "editora": "DC Comics"
  }
### Deletar Herói

- **Endpoint:** `DELETE /herois/:id`
- **Descrição:** Remove um herói específico do sistema.
- **Parâmetros da Requisição:**
  - `id`: ID do herói a ser removido.
- **Resposta:** Retorna mensagem de sucesso.

---

### Realizar Batalha entre Heróis

- **Endpoint:** `GET /herois/:heroi_1/:heroi_2`
- **Descrição:** Inicia uma batalha entre dois heróis e retorna o vencedor.
- **Parâmetros da Requisição:**
  - `heroi_1`: ID do primeiro herói.
  - `heroi_2`: ID do segundo herói.
- **Resposta:**
  - Se houver um vencedor, retorna os detalhes do vencedor e a batalha registrada no histórico.
  - Caso contrário, informa que os heróis não foram encontrados ou que houve empate.
### Obter Histórico de Batalhas

- **Endpoint:** `GET /historico`
- **Descrição:** Retorna o histórico de todas as batalhas realizadas.
- **Resposta:**
  ```json
  {
    "total": 1,
    "historico": [
      {
        "id": 1,
        "nome_heroi_1": "Superman",
        "nome_heroi_2": "Batman",
        "nome_vencedor": "Superman",
        "nome_perdedor": "Batman"
      }
    ]
  }
### Pesquisar Batalha por Nome de Herói

- **Endpoint:** `GET /batalha/nomeHeroi/:nome`
- **Descrição:** Pesquisa batalhas que envolvem um herói com um determinado nome.
- **Parâmetros da Requisição:**
  - `nome`: Nome do herói a ser pesquisado.
- **Resposta:** Retorna as batalhas encontradas para o herói pesquisado.

---

**Pré-requisitos:**

- Node.js instalado
- PostgreSQL instalado e configurado com a base de dados `batalhaherois`
