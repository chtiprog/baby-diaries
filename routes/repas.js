var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true}));
router.use(methodOverride(function(req,res){
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// REST operations for repas accessible from http://127.0.0.1:3000/repas
router.route('/')
// GET all repas
  .get(function(req,res,next) {
    // retrieve all repas from Mongo
    mongoose.model('Repas').find({}, function(err, repas) {
      if(err){
        return console.error(err);
      }else {
        // JSON responses require 'Accept: application/json;' in the request header
        res.format({
          html: function() {
            res.render('repas_liste', {
              title: 'Tous mes repas',
              "repas": repas
            });
          },
          json: function() {
            res.json(repas);
          }
        });
      }
    });
  })

// POST a new repas
  .post(function(req,res){
    // Get values from POST resquest.
    var menu = req.body.menu;
    var dob = req.body.dob;
    mongoose.model('Repas').create({
      menu : menu,
      dob : dob
    }, function(err,repas){
      if(err) {
        res.send("Il y a eu un problème en ajouter les informations (repas) à la base de donnée.");
      }else{
        console.log('POST creation nouveau repas : ' + repas);
        res.format({
          html: function(){
            res.location("repas");
            res.redirect("/repas");
          },
          json: function(){
            res.json(repas);
          }
        });
      }
    });
  });

/* GET New Repas page */
router.get('/add', function(req, res) {
  res.render('add_repas', {title: 'Nouveau repas'});
});

// route middleware to validate :id
router.param('id', function(req,res,next,id) {
  //console.log('validating' + id + ' exists');
  // find the ID in the Database
  mongoose.model('Repas').findById(id, function(err, repas) {
    if(err){
      console.log(id + ' pas été trouvé');
      res.status(404);
      res.format({
        html: function(){
          next(err);
        },
        json: function(){
          res.json({message: err.status + ' ' + err});
        }
      });
    }else{
      console.log(repas);
      req.id = id;
      next();
    }
  });
});

router.route('/:id')
  .get(function(req,res){
    mongoose.model('Repas').findById(req.id, function(err, repas){
      if(err){
        console.log('GET Error : il y a eu un problème en retrouvant :' + err);
      }else{
        console.log('GET ID retrouvé : ' + repas._id);
        var repasdob = repas.dob.toISOString();
        repasdob = repasdob.substring(0, repasdob.indexOf('T'));
        res.format({
          html: function(){
            res.render('show_repas', {
              "repasdob" : repasdob,
              "repas" : repas
            });
          },
          json: function(){
            res.json(repas);
          }
        });
      }
    });
  });

router.route('/:id/edit')
// GET the individual repas by Mongo ID
  .get(function(req, res){
    mongoose.model('Repas').findById(req.id, function(err, repas){
      if(err){
        console.log('GET Error: Il y a eu un problème en recherchant : ' + err);
      }else{
        console.log('GET ID retrouvé : ' + repas._id);
        var repasdob = repas.dob.toISOString();
        repasdob = repasdob.substring(0, repasdob.indexOf('T'));
        res.format({
          html: function(){
            res.render('edit_repas', {
              title: 'Repas' + repas._id,
              "repasdob" : repasdob,
              "repas" : repas
            });
          },
          json: function(){
            res.json(repas);
          }
        });
      }
    });
  })
// PUT to update a repas by ID
  .put(function(req,res){
    // Get our REST or form values.
    var menu = req.body.menu;
    var dob = req.body.dob;

    mongoose.model('Repas').findById(req.id, function(err, repas){
      repas.update({
        menu : menu,
        dob : dob
      }, function(err, repasID){
        if(err) {
          res.send("Il y a eu un problème en mettant à jour les informations de la base de donnée: " + err);
        }else {
          res.format({
            html: function(){
              res.redirect("/repas/"+ repas._id);
            },
            json: function(){
              res.json(repas);
            }
          });
        }
      });
    });
  })
//DELETE a Repas by ID
  .delete(function(req,res){
    mongoose.model('Repas').findById(req.id, function(err, repas){
      if (err) {
        return console.error(err);
      }else{
        repas.remove(function(err,repas){
          if(err){
            return console.error(err);
          }else{
            console.log('DELETE removing ID: ' + repas._id);
            res.format({
              html: function(){
                res.redirect("/repas");
              },
              json: function(){
                res.json({message: 'supprimé',
                          item : repas
                         });
              }
            });
          }
        });
      }
    });
  });

/*
router.get('/', function(req, res, next){
  res.render('repas_liste', {title: 'Liste des repas solides'});
});

router.get('/add', function(req, res, next){
  res.render('add_repas', {title: 'Nouveau repas solide'});
});

router.get('/edit', function(req, res, next){
  res.render('edit_repas', {title: 'Edition du repas solide'});
});
*/


module.exports = router;
