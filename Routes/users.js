//instanciando o express;
const express = require('express');
const router = express.Router();
const Users = require("../model/user");                                     //importando o modelo de usuarios ("instanciando");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

//FUNCOES AUXILIARES
const createUserToken = (userId) =>                                         //recebe o userId;
{
    //crio o token e passo o id do usuario (vai ser vinculado ao id), a chave secreta(senha/palavra), a data de expiracao do token em dias;
    return jwt.sign({ id: userId }, config.jwt_pass, { expiresIn: config.jwt_expires_in });
}

router.get("/", async(req, res) => 
{
    try
    {
        const users = await Users.find({});
        return res.send(users);
    }
    catch(err)
    {
        return res.status(500).send({ error: "Erro na consulta de usuarios" });
    }
});

router.post('/', (req, res) =>{
    return res.send({message: `Tudo ok com o metodo post da rota de usuarios!`});
});

router.post("/create", async (req, res) =>                                  //para criar, precisa de no minimo email e senha que eh requerid la;
{
    //const obj = req.body;
    //if(!obj.email || !obj.password) return res.send({ error: "Dados insuficientes!" });     //se nao vier um email e senha, retorna erro;
    const { email, password } = req.body;                                           //chamo ele da forma desestruturada sem o obj;    
    
    if(!email || !password) return res.status(400).send({ error: "Dados insuficientes!" });     //se nao vier um email e senha, retorna erro, posso trabalhar sem o "!obj.";

    try 
    {
        if(await Users.findOne({ email })) return res.status(400).send({ error: "Usuario ja registrado!" });  //se ele encontrar ja o email no banco, da erro de "ja registrado";
        
        const user = await Users.create(req.body);                      //cria o usuario;
        user.password = undefined;                                      //preciso colocar para ele nao retornar o password;
        
        //return res.send(user);                                        //devolve o ususario;

        return res.status(201).send({ user, token: createUserToken(user.id) });     //vou criar o usuario e vai ter tambem o token;
    } 
    catch(err) 
    {
        return res.status(500).send({ error: "Erro ao buscar usuario!" });
    }
});

router.post("/auth", async (req, res) => 
{
    const {email, password} = req.body;                                         //vai receber estes campos respectivamentes do req.body;
    
    if(!email || !password) return res.status(400).send({ error: "Dados insuficientes!" });                     //se nao tiver email ou senha, retorna erro;
     
    try
    {
        const user = await Users.findOne({ email }).select("+password");        //passo o email e seleciono a senha tb, buscou o usuario e salvou na variavel os dados dele;
        
        //verifica se tem dados na variavel, se foi encontrado no caso no banco;
        if(!user) return res.status(400).send({ error: "Usuario nao registrado!" });        //se nao encontrar o usuario, retorna o erro; 
        
        const pass_ok = await bcrypt.compare(password, user.password);          //vai setar true ou false se as senhas baterem ou nao, comparando elas;
        
        if(!pass_ok) return res.status(401).send({ error: "Erro ao autenticar usuario!" });       //se o pass_ok bater as senhas corretamente;

        user.password = undefined;                                              //nao deixa retornar a senha;
        //return res.send(user);                                                //retorna o usuario;

        return res.send({ user, token: createUserToken(user.id) });             //autentica e cria o token;
    }
    catch(err)
    {
        return res.status(500).send({ error: "Erro ao buscar o usuario" });
    }

});

module.exports = router;