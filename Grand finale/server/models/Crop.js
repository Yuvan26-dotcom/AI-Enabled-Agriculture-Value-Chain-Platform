const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  variety: String,
  duration: String,
  oilContent: String,
  suitableSoil: String,
  sowingSeason: String,
  harvestSeason: String,
  image: String
});

module.exports = mongoose.model('Crop', cropSchema);