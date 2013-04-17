var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId

var DelegationSchema = new Schema({
    truster: { type: ObjectId, ref:'Citizen', required: true }
  , tag: { type: ObjectId, ref: 'Tag', required: true }
  , trustees: [{ type: ObjectId, ref: 'Citizen' }]
  , updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delegation', DelegationSchema);