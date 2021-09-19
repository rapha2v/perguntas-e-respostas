const express = require('express');
const app = express();
const port = 80; // número do porto, para ser usado no método listen()
const routes = require("./routes"); // importando as rotas

app.use(routes);//Falando pro express para usar as rotas do arquivo routes



app.set("view engine", "ejs"); //como setar o EJS como renderizador de HTML .set()
app.use(express.static(__dirname + "/public")); // arquivos estáticos .use()
//imagens, css, js front-end
//a partir disso é só consumir normal os arquivos e não precisa colocar /public
//pois o node já via procurar dentro do arquivo public

//Qual porta o servidor express está escutando
app.listen(port, (err) => {
    if (err) throw new Error(`Algo deu errado => ${err}`); //lança um novo erro caso o servidor não consiga ser iniciado
    else console.log(`Server iniciado com sucesso!`);
});