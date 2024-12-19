const mongoose = require('mongoose');

const precomputedSchema = new mongoose.Schema({
  location: [Number], // [longitude, latitude]
  radius: Number,
  properties: [mongoose.Schema.Types.Mixed],
});

module.exports = mongoose.model('PrecomputedResults', precomputedSchema);