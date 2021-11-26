const jwt = require('jsonwebtoken'); // package de gestion des Token: permet de vérifier que les requêtes sont authentifiées


module.exports = (req, res, next) => {
    try {
        // Récupérer le Token dans la requête du front (2ème mot de l'en-tête 'header')
        const token = req.headers.authorization.split(' ')[1];
        // Décoder le TOKEN
        const decodedToken = jwt.verify(token, `${process.env.A79835B22B72F2}`);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Utilisateur non valide';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Requête non valide')
        });
    }
};

