var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/*
 * Comment Reply Schema
 */
var CommentReplySchema = new Schema({
    author: {type: ObjectId, required: true, ref: 'Citizen'}
  , text: {type: String}
  , createdAt: {type: Date, default: Date.now}
});

/*
 * Comment Schema
 */
var CommentSchema = new Schema({
    author:     { type: ObjectId, required: true, ref: 'Citizen' }
  , text:       { type: String, required: true }
  , replies:    [ CommentReplySchema ]

  // Referente to the ObjectId of the Discussion Context
  , reference:  { type: ObjectId, required: true }
  // Discussion Context
  , context:    { type: String, default: 'proposal', enum: ['proposal'] }

  , createdAt:  { type: Date, default: Date.now }
});


CommentSchema.post('save', function(comment) {
  var Element = this.context.charAt(0).toUpperCase() + this.context.slice(1);

  try {
    Element = this.model(Element);
  } catch (err) {
    console.log(err);
    return;
  }
  
  Element.findById(this.reference, function(err, element) {
    element.census.addToSet(comment.author);
    comment.replies.forEach(function(reply) {
      element.census.addToSet(reply.author);
    });

    if(element.isModified()) {
      element.save(function(err) {
        if(err) console.log(err);
      });
    }
  });
});

module.exports = mongoose.model('Comment', CommentSchema);