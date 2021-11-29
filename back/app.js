const express = require('express');
const mongoose = require('mongoose'); // Package de modelisation des données MongoDB
const path = require('path'); // Donne accès au chemin de notre stockage de fichiers
const cors = require('cors'); // Permet aux serveurs front et back de communiquer
require('dotenv/config'); // Cache les données de connexion lors de l'envoi des requêtes
const helmet = require("helmet"); // Aide à sécuriser l'app, colmate certaines failles de sécurité

const app = express();

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');


mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(() => console.log('Connexion à MongoDB échouée'));


app.use(cors());
app.use(express.json());
app.use(helmet());

// Permet l'accès au dossier de stockage des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Utilisation des routes, contient le début du chamin d'accès
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;