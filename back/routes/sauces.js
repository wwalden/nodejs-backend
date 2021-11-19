const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');


router.get('/', auth, saucesCtrl.getAllElement);
router.post('/', auth, multer, saucesCtrl.createElement);
//router.post('/', multer, saucesCtrl.createElement);

router.get('/:id', saucesCtrl.getOneElement);
//router.get('/:id', saucesCtrl.getOneElement);

//router.put('/:id', auth, multer, saucesCtrl.modifyElement);
//router.delete('/:id', auth, saucesCtrl.deleteElement);


module.exports = router;