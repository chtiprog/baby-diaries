var mongoose = require('mongoose');
var jusSchema = new mongoose.Schema({
  fruits: {type: String, required: true},
  quantite: {type: Number, required: true},
  dob: {type: Date, default: Date.now}
});
mongoose.model('Jus', jusSchema);
