var mongoose = require('mongoose');
var biberonSchema = new mongoose.Schema({
  quantite: { Number, required: true},
  dob: { type: Date, default: Date.now }
});
mongoose.model('Biberon', biberonSchema);
