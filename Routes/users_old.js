//instanciando o express;
const express = require('express');
const router = express.Router();
const Users = require("../model/user");                                     //importando o modelo de usuarios ("instanciando");
const bcrypt = require("bcrypt");

router.get('/', (req, res) =>{
    Users.find({}, (err, data) => {
        if(err) return res.send({ error: "Erro na consulta de usuarios!" });    //se der erro, retorna o erro;
        return res.send(data);                                                  //se nao der erro, retorna (data), que sao os usuarios;
    });
});

router.post('/', (req, res) =>{
    return res.send({message: `Tudo ok com o metodo post da rota de usuarios!`});
});

router.post('/create', (req, res) => {                                          //para criar, precisa de no minimo email e senha que eh requerid la;
    //const obj = req.body;
    //if(!obj.email || !obj.password) return res.send({ error: "Dados insuficientes!" });     //se nao vier um email e senha, retorna erro;
    const { email, password } = req.body;                                           //chamo ele da forma desestruturada sem o obj;    
    if(!email || !password) return res.send({ error: "Dados insuficientes!" });     //se nao vier um email e senha, retorna erro, posso trabalhar sem o "!obj.";

    //vou buscar um usuario, e verificar se o email recebido eh igual ao email do banco;
    Users.findOne({email}, (err, data) => {                                 //ele vai entender que o campo se chama email, que ele esta buscando;
        if(err) return res.send({ error: "Erro ao buscar usuario!" });
        if(data) return res.send({ error: "Usuario ja registrado!" });      //se ele encontrar dados = data, ja existe;

        Users.create(req.body, (err, data) => {                             //no callback passo o err, data, se nenhum dos de cima aconteceu, ele cria o usuario com "req.body";
            if (err) return res.send({ erro: "Erro ao criar usuario!" });   //se deu erro ao criar o usuario com req.body;

            data.password = undefined;                                      //preciso colocar para ele nao retornar o password;
            return res.send(data);
        });
    });
    
});

router.post("/auth", (req, res) => {
    const {email, password} = req.body;                                         //vai receber estes campos respectivamentes do req.body;
    
    if(!email || !password) return res.send({ error: "Dados insuficientes!" }); //se nao tiver email ou senha, retorna erro;

    Users.findOne({email}, (err, data) =>                                       //faz uma busca no banco por um usuario, o data contem a senha criptografada que veio do banco;
    {
        if(err)
        {
        return res.send({ error: "Erro ao buscar o usuario" });         //se deu erro na busca, ele retorna erro;
        }
        
        if(!data) 
        {
        return res.send({ error: "Usuario nao registrado!" });        //se !nao tem/existe usuario, vc ta tentando autenticar um usuario que nao existe, da erro;
        }

        //criptografo o password que veio do req.body(), e comparo o password que veio do banco criptografado no data.password;
        bcrypt.compare(password, data.password, (err, same) =>
        {
            if(!same)                                                           //se as senhas forem diferentes;
            {
                return res.send({ error: "Erro ao autenticar o usuario!" });
            } 
            else                                                                //se as senhas forem iguais;
            {
                data.password = undefined;                                      //pego a senha que vem do banco (que eu vou ver em tela) e nao exibo, sumo com ela;
                return res.send(data);
            }
        });

    }).select("+password");                                                     //eu vou dar um select no password, obrigando a enviar a senha;
});


module.exports = router;