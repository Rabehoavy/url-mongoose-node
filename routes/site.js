var express = require('express');
var router = express.Router()

const siteController = require('../controllers/siteController');

/* GET site page. */
router.get('/', siteController.formulaire);
router.post('/add', siteController.save);
router.get('/:id', siteController.url);

module.exports = router;
