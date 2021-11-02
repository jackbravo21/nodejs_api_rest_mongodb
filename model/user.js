const mongoose = require('mongoose');
const Schema = mongoose.Schema;             //importa o proprio modelo
const bcrypt = require("bcrypt");           //para criptografar

const UserSchema = new Schema({
//tipo string, campo obrigatorio required:true, seja unico unique:true, e tudo minusculo lowercase:true, select false voce nao recebe esse campo na busca;
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    created: { type: Date, default: Date.now }                                  //mostra o horario que o usuario foi criado. Ele preenche sozinho;
});

UserSchema.pre("save", async function(next)                                          //nao usamos arrow function porque da problema quando usamos o "this", chamamos a funcao next;
{
    let user = this;

    if(!user.isModified("password"))
    {
        return next();                             //se o usuario !nao foi modificado no campo "password", ele da um next(segue em frente);
    }
    user.password = await bcrypt.hash(user.password, 10);                       //10 saltos de hash;
    return next();
});


//vou exportar ja chamando o user schema
module.exports = mongoose.model('User', UserSchema);