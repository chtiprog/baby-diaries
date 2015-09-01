var mongoose = require('mongoose');
var repasSchema = new mongoose.Schema({
  menu: String,
  dob: { type: Date, default: Date.now }
});
mongoose.model('Repas', repasSchema);
