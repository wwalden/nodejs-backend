const express = require('express');
const mongoose = require('mongoose'); // Package de modèlisation des données MongoDB
const path = require('path');
const cors = require('cors'); // permet aux serveurs front et back de communiquer
require('dotenv/config'); // cache les données de connexion lors de l'envoi des requêtes

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

app.use('/images', express.static(path.join(__dirname, 'images')));

// Utilisation des routes, contient le début du chamin d'accès
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;