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
