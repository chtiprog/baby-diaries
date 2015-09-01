var mongoose = require('mongoose');
var allaitementSchema = new mongoose.Schema({
  sein: String,
  duree: Number,
  dob: { type: Date, default: Date.now}
});
mongoose.model('Allaitement', allaitementSchema);
