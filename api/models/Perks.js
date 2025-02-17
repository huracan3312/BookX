const mongoose = require('mongoose');

const PerksSchema = new mongoose.Schema({
  name: {type:String, required:true},
  description: {type:String, required:true},
  icon: {type:String, required:true},
});

const PerksModel = mongoose.model('Perks', PerksSchema);

module.exports = PerksModel;