const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.valida();
        if(this.errors.length > 0){
            return;
        };

        await this.userExists();
        if(this.errors.length > 0){
            return;
        };

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
    
        this.user = await LoginModel.create(this.body);    
    }

    async login(){
        this.valida();
        if(this.errors.length > 0){
            return;
        };

        this.user = await LoginModel.findOne({ email: this.body.email });
        if (!this.user) {
            this.errors.push("Usuário não existe.")
            return;
        }

        const isPasswordValid = await bcryptjs.compare(this.body.password, this.user.password);
        if (!isPasswordValid) {
            this.errors.push("Senha incorreta.");
            this.user = null;
            return;
      }
    }

    async userExists(){
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) {
            this.errors.push("Usuário já existe.")
        }
    }

    valida() {
        this.cleanUp();
        // E-mail precisa ser válido
        if(!validator.isEmail(this.body.email)) {
            this.errors.push("E-mail inválido.")
        }

        // Senha precisa ter entre 3 e 30 caracteres
        if(this.body.password.length <3 || this.body.password.length > 30) {
            this.errors.push("A senha precisa ter entre 3 e 30 caracteres.")
        }

    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;