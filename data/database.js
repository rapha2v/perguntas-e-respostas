var knex = require("knex")({ //dados do banco de dados
    client: "mysql2",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "4312",
        database: "guiaperguntas"
    }
});

module.exports = knex;