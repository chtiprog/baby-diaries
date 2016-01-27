var mongoose = require('mongoose');
var allaitementSchema = new mongoose.Schema({
  sein: { type: String, default: "gauche"},
  duree: Number,
  dob: { type: Date, default: Date.now}
});
mongoose.model('Allaitement', allaitementSchema);
