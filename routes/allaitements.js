var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // parses information from POST
var methodOverride = require('method-override'); // used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true}));
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//build the REST operations at the base for allaitements
// this will be accessible from http://127.0.0.1:3000/allaitements if the default route for / is left unchanged
router.route('/')
// GET all allaitements
  .get(function(req, res, next){
    //retrieve all allaitements from Monogo
    mongoose.model('Allaitement').find({}, function(err, allaitements){
      if (err){
        return console.error(err);
      } else {
        // respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
        res.format({
          //HTML response will render the index.jade file in the views folder. We are also setting "allaitements" to be an accesible variable in our jade view
          html: function(){
            res.render('allaitement_liste', {
              title: 'Toutes mes têtées',
              "allaitements" : allaitements
            });
          },
          // JSON response will show all allaitements in JSON format
          json: function(){
            res.json(allaitements);
          }
        });
      }
    });
  })

//POST a new allaitement
  .post(function(req,res) {
    // Get values from POST request, these can be done through forms or REST calls. These rely on th "name" attributes for forms
    var sein = req.body.sein;
    var duree = req.body.duree;
    var dob = req.body.dob;
    // call the create function for our database
    mongoose.model('Allaitement').create({
      sein: sein,
      duree: duree,
      dob: dob
    }, function(err, allaitement) {
      if (err){
        res.send("Il y a eu un problème en ajoutant les informations (allaitement) à la base de donnée.");
      } else {
        // biberon has been created
        console.log('POST creation nouveau allaitement: ' + allaitement);
        res.format({
          // HTML response will set the location and redirect back to the home page. You could also create a "success" page if that's your thing
          html: function(){
            // If it worked, set the header so the address bar doesn't still say / add user
            res.location("allaitements");
            // And forward to success page
            res.redirect("/allaitements");
          },
          // JSON response will show the newly created allaitement
          json: function(){
            res.json(allaitement);
          }
        });
      }
    });
  });

/* GET New Allaitement page */
router.get('/add', function(req,res) {
  res.render('add_allaitement', { title: "Nouvelle têtée"});
});

// route middleware to validate :id
router.param('id', function(req,res, next, id) {
  //console.log('validating ' + id + 'exists');
  //find the ID in the Database
  mongoose.model('Allaitement').findById(id, function (err, allaitement) {
    // if it isn't found, we are going to respond with 404
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
          res.json({message: err.status + ' ' + err});
        }
      });
      // if it is found we continue
    } else {
      // uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
      console.log(allaitement);
      // once validation is done save the new item in the req
      req.id = id;
      // go to the next thing
      next();
    }
  });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Allaitement').findById(req.id, function(err, allaitement) {
      if(err) {
        console.log('GET Error: Il y a eu un problème en retrouvant : ' + err);
      }else {
        console.log('GET ID retrouvé : ' + allaitement._id);
        var allaitementdob = allaitement.dob.toISOString();
        allaitementdob = allaitementdob.substring(0, allaitementdob.indexOf('T'));
        res.format({
          html: function(){
            res.render('show_allaitement', {
              "allaitementdob": allaitementdob,
              "allaitement": allaitement
            });
          },
          json: function(){
            res.json(allaitement)
          }
        });
      }
    });
  });

router.route('/:id/edit')
// GET the individual allaitement by Mongo ID
  .get(function(req, res) {
    // search for the allaitement within Mongo
    mongoose.model('Allaitement').findById(req.id, function(err, allaitement) {
      if(err){
        console.log('GET Error : Il y a eu un problème en recherchant : ' + err);
      }else{
        // Return the biberon
        console.log('GET ID retrouvé : ' + allaitement._id);
        var allaitementdob = allaitement.dob.toISOString();
        allaitementdob = allaitementdob.substring(0, allaitementdob.indexOf('T'));
        res.format({
          // HTML response will render the 'edit.jade' template
          html: function(){
            res.render('edit_allaitement', {
              title: 'Têtée' + allaitement._id,
              "allaitementdob" : allaitementdob,
              "allaitement": allaitement
            });
          },
          //JSON response will return the JSON output
          json: function(){
            res.json(allaitement);
          }
        });
      }
    });
  })
// PUT to update an allaitement by ID
  .put(function(req, res){
    // GET our REST or form values. These rely on the "name" attributes
    var sein = req.body.sein;
    var duree = req.body.duree;
    var dob = req.body.dob;

    // find the document by ID
    mongoose.model('Allaitement').findById(req.id, function(err, allaitement) {
      // update it
      allaitement.update({
        sein : sein,
        duree : duree,
        dob : dob
      }, function(err, allaitementID) {
        if (err) {
          res.send("Il y a eu un problème en mettant à jour les informations de la base de donnée : " + err);
        }
        else {
          // HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function() {
              res.redirect("/allaitements/" + allaitement._id);
            },
            // JSON responds showing the updated values
            json: function(){
              res.json(allaitement);
            }
          });
        }
      });
    });
  })
// DELETE an Allaitement by ID
  .delete(function (req, res) {
    // finc allaitement by ID
    mongoose.model('Allaitement').findById(req.id, function (err, allaitement) {
      if (err) {
        return console.error(err);
      } else {
        // remove it from Mango
        allaitement.remove(function (err, allaitement){
          if (err) {
            return console.error(err);
          }else{
            // remove it from Mongo
            allaitement.remove(function (err, allaitement){
              if (err){
                return console.error(err);
              }else{
                // returning success messages saying it was deleted
                console.log('Suppression ID: ' + allaitement._id );
                res.format({
                  // HTML return us back to the main page, or you can create a success page
                  html: function() {
                    res.redirect("/allaitements");
                  },
                  //JSON returns the item with the message that is has been deleted
                  json: function(){
                    res.json({message: 'supprimé',
                              item: allaitement});
                  }
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
  res.render('allaitement_liste', {title: 'Liste des têtées'});
});

router.get('/add', function(req, res, next){
  res.render('add_allaitement', {title: 'Nouvelle têtée'});
});

router.get('/edit', function(req, res, next){
  res.render('edit_allaitement', {title: 'Edition de la têtée'});
});
*/


module.exports = router;
