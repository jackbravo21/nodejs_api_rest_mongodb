//instanciando o express;
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//string de conexao --> Endereco externo do seu mongoDB

router.get('/', auth, (req, res) =>{                        //agora aqui, o "/" vai passar pelo middleware de autenticacao antes;
    
    console.log(res.locals.auth_data);                                              //posso mostrar essa informacao de usuario no console com o id dele no banco de dados;
    
    return res.send({message: `Voce esta na Raiz autenticada!`});
});

router.post('/', (req, res) =>{
    return res.send({message: `Tudo ok com o metodo post da Raiz indexRoute!`});
});

module.exports = router;