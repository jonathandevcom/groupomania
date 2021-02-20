const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-gif');

router.route('/')
// ajouter l'auth
    .get(messageCtrl.postAllMessages)
    .post(multer, messageCtrl.createOneMessage)
 
router.route('/:id')
    .get(auth, messageCtrl.postOneMessage)
    .delete(auth, messageCtrl.deleteOneMessage)
    .put(auth, multer, messageCtrl.editOneMessage)

module.exports = router;