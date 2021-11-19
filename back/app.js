const express = require('express');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const helmet = require("helmet");
const cors = require('cors');
const nocache = require('nocache');


mongoose.connect('mongodb+srv://test_boy:azerty@cluster0.td4qi.mongodb.net/saucesDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(helmet());
app.use(nocache());
app.use(cors());

/*
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
*/

/*
  app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', process.env.SECRET_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
*/


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());
app.use('/api/sauces', sauceRoutes);
//app.use('/api/sauce', saucesRoutes);
//app.use('/', saucesRoutes);

app.use('/api/auth', userRoutes);

module.exports = app;
