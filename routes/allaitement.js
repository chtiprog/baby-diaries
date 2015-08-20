var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('allaitement_liste', {title: 'Liste des têtées'});
});

router.get('/add', function(req, res, next){
  res.render('add_allaitement', {title: 'Nouvelle têtée'});
});

router.get('/edit', function(req, res, next){
  res.render('edit_allaitement', {title: 'Edition de la têtée'});
});



module.exports = router;
