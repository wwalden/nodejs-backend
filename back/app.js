const express = require('express');

const app = express();

app.use((req, res) => {
   res.json({ message: 'watashi wa backend!' }); 
});

module.exports = app;