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

//build the REST operations at the base for biberons
//this will be accessible from http://127.0.0.1:3000/biberons if the default route for / is left unchanged
router.route('/')
//GET all biberons
  .get(function(req, res, next) {
    //retrieve all biberons from Monogo
    mongoose.model('Biberon').find({}, function (err, biberons) {
      if (err) {
        return console.error(err);
      } else {
        //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
        res.format({
          //HTML response will render the index.jade file in the views folder. We are also setting "biberons" to be an accessible variable in our jade view
          html: function(){
            res.render('biberons_liste', {
              title: 'Tous mes biberons',
              "biberons" : biberons
            });
          },
          //JSON response will show all biberons in JSON format
          json: function(){
            res.json(biberons);
          }
        });
      }
    });
  })

//POST a new biberon
  .post(function(req, res) {
    // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    req.checkBody('quantite', 'quantite invalide').notEmpty().isInt();
    var quantite = req.body.quantite;
    var dob = req.body.dob || null;
    var nouveauBiberon = null;
    var errors = req.validationErrors();
    if (errors) {
    res.send('Il y a des erreurs de validations: ' + util.inspect(errors), 400);
    return;
  }
    if (dob) {
      nouveauBiberon = {quantite: quantite, dob: dob};
    } else {
      nouveauBiberon = {quantite: quantite};
    }
    //call the create function for our database
    mongoose.model('Biberon').create(nouveauBiberon, function (err, biberon) {
      if (err) {
        res.send("Il y a eu un problème en ajoutant les informations à la base de donnée.");
      } else {
        //Biberon has been created
        console.log('POST creation nouveau biberon: ' + biberon);
        res.format({
          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: function(){
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("biberons");
            // And forward to success page
            res.redirect("/biberons");
          },
          //JSON response will show the newly created blob
          json: function(){
            res.json(biberon);
          }
        });
      }
    });
  });

/* GET New Biberon page. */
router.get('/add', function(req, res) {
  res.render('add_biberon', { title: 'Nouveau biberon' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
  //console.log('validating ' + id + ' exists');
  //find the ID in the Database
  mongoose.model('Biberon').findById(id, function (err, biberon) {
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
      console.log(biberon);
      // once validation is done save the new item in the req
      req.id = id;
      // go to the next thing
      next();
    }
  });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Biberon').findById(req.id, function (err, biberon) {
      if (err) {
        console.log('GET Error: Il y a eu un problème en retrouvant: ' + err);
      } else {
        console.log('GET ID retrouvé : ' + biberon._id);
        var biberondob = biberon.dob.toISOString();
        biberondob = biberondob.substring(0, biberondob.indexOf('T'));
        res.format({
          html: function(){
            res.render('show_biberon', {
              "biberondob" : biberondob,
              "biberon" : biberon
            });
          },
          json: function(){
            res.json(biberon);
          }
        });
      }
    });
  });


router.route('/:id/edit')
//GET the individual biberon by Mongo ID
  .get(function(req, res) {
    //search for the biberon within Mongo
    mongoose.model('Biberon').findById(req.id, function (err, biberon) {
      if (err) {
        console.log('GET Error: Il y a eu un problème en recherchant: ' + err);
      } else {
        //Return the biberon
        console.log('GET ID retrouvé : ' + biberon._id);
        var biberondob = biberon.dob.toISOString();
        biberondob = biberondob.substring(0, biberondob.indexOf('T'));
        res.format({
          //HTML response will render the 'edit.jade' template
          html: function(){
            res.render('edit_biberons', {
              title: 'Biberon' + biberon._id,
              "biberondob" : biberondob,
              "biberon" : biberon
            });
          },
          //JSON response will return the JSON output
          json: function(){
            res.json(biberon);
          }
        });
      }
    });
  })
//PUT to update a biberon by ID
  .put(function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var quantite = req.body.quantite;
    var dob = req.body.dob;

    //find the document by ID
    mongoose.model('Biberon').findById(req.id, function (err, biberon) {
      //update it
      biberon.update({
        quantite : quantite,
        dob : dob
      }, function (err, biberonID) {
        if (err) {
          res.send("Il y a eu un problème en mettant à jour les informations de la base de donnée: " + err);
        }
        else {
          //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function(){
              res.redirect("/biberons/" + biberon._id);
            },
            //JSON responds showing the updated values
            json: function(){
              res.json(biberon);
            }
          });
        }
      });
    });
  })
//DELETE a Biberon by ID
  .delete(function (req, res){
    //find biberon by ID
    mongoose.model('Biberon').findById(req.id, function (err, biberon) {
      if (err) {
        return console.error(err);
      } else {
        //remove it from Mongo
        biberon.remove(function (err, biberon) {
          if (err) {
            return console.error(err);
          } else {
            //Returning success messages saying it was deleted
            console.log('DELETE removing ID: ' + biberon._id);
            res.format({
              //HTML returns us back to the main page, or you can create a success page
              html: function(){
                res.redirect("/biberons");
              },
              //JSON returns the item with the message that is has been deleted
              json: function(){
                res.json({message : 'supprimé',
                          item : biberon
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
