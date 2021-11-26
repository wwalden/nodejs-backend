const mongoose = require('mongoose');
// renforce la sécurité permettant de ne créer qu'un seul utilisateur par identifiant
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    // permet de s'assurer qu'un seul utilisateur est créé par identifiant
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
