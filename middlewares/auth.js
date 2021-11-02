const jwt = require("jsonwebtoken");
const config = require("../config/config")

const auth = (req, res, next) => 
{
    const token_header = req.headers.auth;                                                      //token vai receber o headers.auth (token tem que vim do headers com o parametro "auth");
    if(!token_header) return res.status(401).send({ error: "Autenticacao recusada! Token nao enviado!" });         //se nao existir o token, se vier vazio, recusa;

    jwt.verify(token_header, config.jwt_pass, (err, decoded) =>                   //verifica se ele eh valido ou nao, tem que coincidir com o secret e o (rowback);
    {
        if(err) return res.status(401).send({ error: "Token invalido!" });                      //retorna o erro caso seja invalido;

        res.locals.auth_data = decoded;                                             //armazeno no locals o id do usuario que vem no token (ja que o token eh baseado no id do user), guardei no locals quem eh esse cara;

        return next();                                                              //tudo dando certo, soh correr pro abraco;
    });
}

module.exports = auth;
