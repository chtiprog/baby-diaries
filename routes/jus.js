var express = require('express');
var util = require('util');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // parses information from POST
var expressValidator = require('express-validator');
var methodOverride = require('method-override'); // used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//build the REST operations at the base for jus
//this will be accessible from http://127.0.0.1:3000/jus if the default route for / is left unchanged
router.route('/')
//GET all jus
  .get(function(req, res, next) {
    //retrieve all jus from Monogo
    mongoose.model('Jus').find({}, function (err, jus) {
      if (err) {
        return console.error(err);
      } else {
        //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
        res.format({
          //HTML response will render the index.jade file in the views folder. We are also setting "jus" to be an accessible variable in our jade view
          html: function(){
            res.render('jus_liste', {
              title: 'Tous mes jus',
              "jus" : jus
            });
          },
          //JSON response will show all jus in JSON format
          json: function(){
            res.json(jus);
          }
        });
      }
    });
  })

//POST a new jus
  .post(function(req, res) {
    // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    req.checkBody('fruits', 'fruits invalide').notEmpty().isAlpha();
    req.checkBody('quantite', 'quantite invalide').notEmpty().isInt();
    var fruits = req.body.fruits;
    var quantite = req.body.quantite;
    var dob = req.body.dob || null;
    var nouveauJus = null;
    var errors = req.validationErrors();
    if (errors) {
    res.send('Il y a des erreurs de validations: ' + util.inspect(errors), 400);
    return;
  }
    if (dob) {
      nouveauJus = {fruits: fruits, quantite: quantite, dob: dob};
    } else {
      nouveauJus = {fruits: fruits, quantite: quantite};
    }
    //call the create function for our database
    mongoose.model('Jus').create(nouveauJus, function (err, jus) {
      if (err) {
        res.send("Il y a eu un problème en ajoutant les informations à la base de donnée.");
      } else {
        // jus has been created
        console.log('POST creation nouveau jus: ' + jus);
        res.format({
          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: function(){
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("jus");
            // And forward to success page
            res.redirect("/jus");
          },
          //JSON response will show the newly created blob
          json: function(){
            res.json(jus);
          }
        });
      }
    });
  });

/* GET New jus page. */
router.get('/add', function(req, res) {
  res.render('add_jus', { title: 'Nouveau jus' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
  //console.log('validating ' + id + ' exists');
  //find the ID in the Database
  mongoose.model('Jus').findById(id, function (err, jus) {
    //if it isn't found, we are going to repond with 404
    if (err) {
      console.log(id + ' pas été trouvé');
      res.status(404);
      var err = new Error('Not Found');
      err.status = 404;
      res.format({
        html: function(){
          next(err);
        },
        json: function(){
          res.json({message : err.status  + ' ' + err});
        }
      });
      //if it is found we continue on
    } else {
      //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
      console.log(jus);
      // once validation is done save the new item in the req
      req.id = id;
      // go to the next thing
      next();
    }
  });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Jus').findById(req.id, function (err, jus) {
      if (err) {
        console.log('GET Error: Il y a eu un problème en retrouvant: ' + err);
      } else {
        console.log('GET ID retrouvé : ' + jus._id);
        var jusdob = jus.dob.toISOString();
        jusdob = jusdob.substring(0, jusdob.indexOf('T'));
        res.format({
          html: function(){
            res.render('show_jus', {
              "jusdob" : jusdob,
              "jus" : jus
            });
          },
          json: function(){
            res.json(jus);
          }
        });
      }
    });
  });


router.route('/:id/edit')
//GET the individual jus by Mongo ID
  .get(function(req, res) {
    //search for the jus within Mongo
    mongoose.model('Jus').findById(req.id, function (err, jus) {
      if (err) {
        console.log('GET Error: Il y a eu un problème en recherchant: ' + err);
      } else {
        //Return the jus
        console.log('GET ID retrouvé : ' + jus._id);
        var jusdob = jus.dob.toISOString();
        jusdob = jusdob.substring(0, jusdob.indexOf('T'));
        res.format({
          //HTML response will render the 'edit.jade' template
          html: function(){
            res.render('edit_jus', {
              title: 'Jus' + jus._id,
              "jusdob" : jusdob,
              "jus" : jus
            });
          },
          //JSON response will return the JSON output
          json: function(){
            res.json(jus);
          }
        });
      }
    });
  })
//PUT to update a jus by ID
  .put(function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    req.checkBody('fruits', 'fruits invalide').notEmpty().isAlpha();
    req.checkBody('quantite', 'quantite invalide').notEmpty().isInt();
    var fruits = req.body.fruits;
    var quantite = req.body.quantite;
    var dob = req.body.dob || null;
    var nouveauJus = null;
    var errors = req.validationErrors();
    if (errors) {
    res.send('Il y a des erreurs de validations: ' + util.inspect(errors), 400);
    return;
  }
    if (dob) {
      nouveauJus = {fruits: fruits, quantite: quantite, dob: dob};
    } else {
      nouveauJus = {fruits: fruits, quantite: quantite};
    }

    //find the document by ID
    mongoose.model('Jus').findById(req.id, function (err, jus) {
      //update it
      jus.update(nouveauJus, function (err, jusID) {
        if (err) {
          res.send("Il y a eu un problème en mettant à jour les informations de la base de donnée: " + err);
        }
        else {
          //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function(){
              res.redirect("/jus/" + jus._id);
            },
            //JSON responds showing the updated values
            json: function(){
              res.json(jus);
            }
          });
        }
      });
    });
  })
//DELETE a Jus by ID
  .delete(function (req, res){
    //find jus by ID
    mongoose.model('Jus').findById(req.id, function (err, jus) {
      if (err) {
        return console.error(err);
      } else {
        //remove it from Mongo
        jus.remove(function (err, jus) {
          if (err) {
            return console.error(err);
          } else {
            //Returning success messages saying it was deleted
            console.log('DELETE removing ID: ' + jus._id);
            res.format({
              //HTML returns us back to the main page, or you can create a success page
              html: function(){
                res.redirect("/jus");
              },
              //JSON returns the item with the message that is has been deleted
              json: function(){
                res.json({message : 'supprimé',
                          item : jus
                         });
              }
            });
          }
        });
      }
    });
  });

/*
 router.get('/', function(req, res, next) {
 res.render('biberons_liste', {title:'Liste de biberons'});
 });

 router.get('/add', function(req, res, next) {
 res.render('add_biberon', {title:'Nouveau biberon'});
 });

 router.get('/edit', function(req, res, next) {
 res.render('edit_biberon', {title:'Edition biberon'});
 });
 */


module.exports = router;
