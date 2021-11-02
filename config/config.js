//vai ser dependente da variavel de ambiente do node, se o desenvolvedor nao setar a variavel "NODE_ENV", por default ele vai dizer que eh "dev";
const env = process.env.NODE_ENV || "dev";

const config = () =>                                        //crio uma funcao config que retorna uma funcao .env;
{
    switch(env)
    {
        case "dev":
            return{
                db_string: "Digite aqui o endereco externo do seu mongoDB",
                jwt_pass: "batatafrita2021",
                jwt_expires_in: "7d"
            }

        case "html":
            return{
                db_string: "Digite aqui o endereco externo do seu mongoDB",
                jwt_pass: "batatafrita2021",
                jwt_expires_in: "7d"
            } 

        case "prod":
            return{
                db_string: "Digite aqui o endereco externo do seu mongoDB",
                jwt_pass: "batatafrita2021",
                jwt_expires_in: "7d"
            }  
    }
}

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);                        //vai retornar uma funcao .env;

module.exports = config();

//Nota: Aqui os dados de configuracao estao iguais, porem deve ter um bando de desenvolvimento, um de teste, e um de producao;