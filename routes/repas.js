var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('repas_liste', {title: 'Liste des repas solides'});
});

router.get('/add', function(req, res, next){
  res.render('add_repas', {title: 'Nouveau repas solide'});
});

router.get('/edit', function(req, res, next){
  res.render('edit_repas', {title: 'Edition du repas solide'});
});
