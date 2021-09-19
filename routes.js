const express = require("express"); //importando o express
const routes = express.Router(); //importando o gerenciador de rotas do express, para utilizar modularização
const db = require("./data/database"); //importantdo as configurações do DB


//método para enxergar e reconhecer objetos de solicitação
routes.use(express.urlencoded({ extended: false }));
//transforma dados de solicitação em json
routes.use(express.json());

//Rotas


routes.get('/', (req, res) => {
    db("perguntas")
        .orderBy("id", "desc")
        .then(result => { //Consulta na tabela perguntas, ordenada de forma decrescente
        //por padrão o render procura a pasta view 
        res.render("index", { //renderizando a página index de dentro da pasta views.
            perguntas: result // Enviando os dados para o front end
        })
    }).catch(err => {
        console.log(err.message)
    });
});

routes.get("/perguntar", (req, res) => {
    res.render("perguntar");  //renderizando a página perguntar de dentro da pasta views.
});

routes.get("/pergunta/:id", (req, res) => {
    const id = req.params.id; // pegando dados de requisição
    //Consulta dentro da tabela pergunta, buscando pelo id informado no parâmetro
    db("perguntas")
        .where({ id: id })
        .then(resultQuestion => { //consulta na tabela perguntas
            if (resultQuestion != undefined) { //verifica a existência da pergunta
                db("respostas")
                    .where({ pergunta: id })
                    .then(resultResponse => { //Consulta dentro da tabela resposta, buscando uma resposta pelo id da pergunta
                        if(resultResponse != undefined){ //verifica se há uma resposta a ser exibida para essa pergunta
                            res.render("pergunta", {//renderiza a página pergunta com resposta
                                pergunta: resultQuestion[0],
                                resposta: resultResponse
                            });
                        }else{ // se não existir alguma resposta passa apenas a pergunta para o front end
                            res.render("pergunta",{ //renderiza a página pergunta sem resposta
                                pergunta: resultQuestion[0]
                            });
                        }
                    }).catch(err => {
                        console.log(err);
                    });
            }else{ // caso o retorno tenha sido undefined, redireciona para o index, pois a pergunta não existe
                res.redirect("/");
            }
        }).catch(err => {
            console.log(err.message);
        });
});

routes.post("/saveFormQuestion", (req, res) => { //Ação do formulário de registro de pergunta
    const title = req.body.title; //pegando os dados da requisição post
    const question = req.body.question; //pegando os dados da requisição post
    const _question = { //transformando os dados da requisição em objeto
        title: title,
        question: question
    };
    db.insert(_question)
        .into("perguntas")
        .then((result) => { //inserindo registros na tabela perguntas
        res.redirect("/"); //redirecionando para a página da pergunta onde foi realizado a resposta
    }).catch((err) => {
        console.log(err);
    });
});

routes.post("/saveResponse", (req, res) => { //Ação do formulário de registro de resposta
    const response = req.body.response; //pegando os dados da requisição post
    const idQuestion = req.body.idQuestion; //pegando os dados da requisição post
    const _response = { //transformando os dados da requisição em objeto
        resposta: response,
        pergunta: idQuestion
    };
    db.insert(_response)
        .into("respostas")
        .then((result) => { //inserindo registros na tabela respostas
        res.redirect(`/pergunta/${idQuestion}`); //redirecionando para a página da pergunta onde foi realizado a resposta
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = routes; //exportando as rotas