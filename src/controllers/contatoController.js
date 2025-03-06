const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', {
        contato: {}
    });
};

exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(function () {
                return res.redirect('/contato');
            });
            return;
        }

        req.flash('success', 'Contato adicionado com sucesso.');
        req.session.save(function () {
            return res.redirect(`/contato/${contato.contato._id}`);
        });
    } catch (e) {
        console.log(e)
        return res.render('404');
    }
}

exports.edit = async (req, res) => {
    if(!req.params.id){
        return res.render('404');
    }
    
    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) {
        return res.render('404');
    }
    return res.render('contato', { contato });
}

exports.editContato = async (req, res) => {
    try{
        if(!req.params.id){
            return res.render('404');
        }
    
        const contato = new Contato(req.body);
        await contato.editContato(req.params.id);
    
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(function () {
                return res.redirect('/contato');
            });
            return;
        }
    
        req.flash('success', 'Contato alterado com sucesso.');
        req.session.save(function () {
            return res.redirect(`/contato/${contato.contato._id}`);
        });
    } catch(e){
        console.log(e);
        res.render('404');
    }
}

exports.deleteContato = async (req, res) => {
    try{
        if(!req.params.id){
            return res.render('404');
        }
        
        const contato = await Contato.delete(req.params.id);
        if (!contato) {
            return res.render('404');
        }
    
        req.flash('success', 'Contato apagado com sucesso.');
        req.session.save(function () {
            return res.redirect('/');
        });
    } catch(e){
        console.log(e);
        res.render('404');
    }
    
}
