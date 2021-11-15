const Sauce = require('../models/sauces');
const fs = require('fs');


exports.createElement = (req, res, next) => {
      /*
        delete req.body._id;
        const sauce = new Sauce({
            ...req.body
        });
*/
        
    const sauceObject = JSON.parse(req.body.thing);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};


exports.getOneElement =   (req, res, next) => {
 Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.modifyElement =  (req, res, next) => {
 const sauceObject = req.file ?
 {
         ...JSON.parse(req.body.thing),
         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
 } : { ...req.body };
 Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};


exports.deleteElement =  (req, res, next) => {
        Sauce.findOne()
        .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                        Sauce.deleteOne({ _id: req.params.id })
                                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                                .catch(error => res.status(400).json({ error }));
                })
        })
        .catch(error => res.status(500).json({ error }));
};


exports.getAllElement =  (req, res) => {
 //Sauce.find()
 res.json({ message: 'Votre requête (quête!) a bien été reçue !' })
        //.then(sauces => res.status(200).json(sauces))
        //.catch(error => res.status(400).json({ error }));
};