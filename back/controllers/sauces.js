const Sauce = require('../models/Sauce');
//'fs: file system': nous permet de supprimer les images
const fs = require('fs'); 


exports.createSauce = (req, res, next) => {
    // On récupère l'objet contenant les informations de la sauce
    const sauceObject = JSON.parse(req.body.sauce);
    // supprimer de la requête le champ ID créé par MongoDB
    delete sauceObject._id;
    const sauce = new Sauce({
        // opérateur spread (...), raccourci qui évite de détailler tous les éléments de la requête
        ...sauceObject,
        // ajout de l'URL de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce bien enregistrée!'}))
        .catch(error => res.status(400).json({ error }));
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};


exports.modifySauce = (req, res, next) => {
    // Y-a-t-il un New file dans la requête? 
    const sauceObject = req.file ?
    // New file existe
    {
         ...sauceObject,
         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // New file n'existe pas
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce a bien été modifiée'}))
        .catch(error => res.status(400).json({ error }));
};


exports.deleteSauce =  (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        // Récupère le chemin d'accès de l'image et supprime celle-ci du dossier
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Supprime ensuite (call back) la sauce de notre base de donnée
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée!'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};


exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        // Le front renvoie 1: like utilisateur
        case 1:
            // On récupère l'ID de la sauce, et l'on ajoute un like ainsi que la userID
            Sauce.updateOne({ _id: req.params.id },
                // Opérateurs MogoDB de modification des Array
                { $inc: { likes: req.body.like++ },
                $push: { usersLiked: req.body.userId }
                })
                .then((sauce) => res.status(200).json({ message: `Le like a été ajouté` }))
                .catch(error => res.status(400).json({ error }))
            break;
        case -1:
            Sauce.updateOne({ _id: req.params.id },
                { $inc: { dislikes: (req.body.like++) * -1 },
                $push: { usersDisliked: req.body.userId }
                })
                .then((sauce) => res.status(200).json({ message: `Dislike pris en compte` }))
                .catch(error => res.status(400).json({ error }))
            break;
        case 0:
            // Un like ou dislike a été décliqué
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    // On cherche à savoir si c'était un like, puis mis à jour
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                            { $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 }
                            })
                            .then((sauce) => { res.status(200).json({ message: `Like supprimé` }) })
                            .catch(error => res.status(400).json({ error }))
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                            { $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 }
                            })
                            .then((sauce) => { res.status(200).json({ message: `Dislike supprimé` }) })
                            .catch(error => res.status(400).json({ error }))
                    }
                })
                .catch(error => res.status(400).json({ error }))
            break;
    }
};



