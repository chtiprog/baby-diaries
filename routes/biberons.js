var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('biberons_liste', {title:'Liste de biberons'})
});

router.get('/add', function(req, res, next) {
  res.render('add_biberon', {title:'Nouveau biberon'});
});

router.get('/edit', function(req, res, next) {
  res.render('edit_biberon', {title:'Edition biberon'});
});




module.exports = router;
