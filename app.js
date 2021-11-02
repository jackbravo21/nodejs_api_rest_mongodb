const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config/config");                  //add o url de conexao com banco de dados;

const bodyParser = require("body-parser");
//body parser (pegar o body enviado pela api) (devem estar aqui primeiro do codigo, se colocar abaixo ele buga):
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//instancio as rotas(adiciono elas)
const indexRoute = require("./Routes/index");
const usersRoute = require("./Routes/users");

//agora associo as duas instancias no APP
app.use('/', indexRoute);                   //quando o cara bater na raiz, ele vai para indexRoute;
app.use('/users', usersRoute);              //quando acessarem o link users, vai para o usersRoute;

//url de conexao com banco de dados;
const url = config.db_string;
//arquivo de opcoes padroes de banco de dados:
/*
Parametros:
reconnectTries: Numero de tentativas de reconexoes (setado maximo, infinito);
reconnectInterval: o tempo de intervalo de reconexao caso ele perca a conexao;
poolsize: o numero maximo de sockets abertos para esta conexao;
useNewUrlParser: serve para ele nao ficar dando mensagem de erro, se for obsoleto;
*/
const options = { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true };

//conectar no banco:
mongoose.connect(url, options);
mongoose.set("useCreateIndex", true);

//eventos para ele ficar ouvindo e avisar se aconteceu alguma coisa diferente:
mongoose.connection.on('error', (err) => {
    console.log("Erro na conexão com o banco de dados: " + err);
});

mongoose.connection.on('disconnected', () => {
    console.log("Aplicacao desconectada do banco de dados!");
});

//evento que mostra se conectou ou nao:
mongoose.connection.on('connected', () => {
    console.log("Aplicacao conectada ao banco de dados com sucesso! Rodando na porta 3000.");
});


////com arrow function:
/*
app.get('/', (req, res) => {

    return res.send({message: "Tudo certo com o método GET!"});             //criando uma resposta JSON;
});
*/

/*
//sem arrow function:
app.get('/', function(req,res)
{
    return res.send({message: "Tudo certo com o método GET!"});             //criando uma resposta JSON;
});
*/

/*
app.post('/', (req, res) => {
    return res.send({message: "Tudo ok com o metodo POST!"});
});
*/

app.get('/captura', (req, res) => {
    let obj = req.query;                                                    //captura as query vindas da URL.
    return res.send({message: `Tudo ok com o metodo GET! Voce enviou o nome: ${obj.nome}, com idade de ${obj.idade} anos!`});             //criando uma resposta JSON;
});

app.listen(3000);

module.exports = app;