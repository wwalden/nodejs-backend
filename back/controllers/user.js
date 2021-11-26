const bcrypt = require('bcrypt'); // Package de chiffrement, pour hasher les mots de passe
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Package 'Json Web Token', permet de générer des Token cryptés

exports.signup = (req, res, next) =>  {
    // fonction de hashage. le mdp est ici salé 10 fois
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
            .catch(error => res.status(400).json({ error }));
      })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: `L'utilisateur n'existe pas` });
        }
        // fonction bcrypt de comparaison des mots de passe (entré vs valable)
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect' });
            }
            res.status(200).json({
              userId: user._id,
              // Token: permet de vérifier que les requêtes sont authentifiées --> package jwt
              token: jwt.sign(
                { userId: user._id },
                `${process.env.A79835B22B72F2}`,
                { expiresIn: '12h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

