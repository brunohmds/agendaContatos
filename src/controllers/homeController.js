const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    try {
        const contatos = await Contato.buscaContatos();
        return res.render('index', { contatos });
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};
