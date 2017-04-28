const mongoose = require('mongoose')

const Schema = mongoose.Schema

module.exports = function topicsCustomAttrs (ForumSchema) {
  const AttrSchema = new Schema({
    name: { type: String, maxlength: 32, minlength: 1, required: true },
    title: { type: String, maxlength: 128, minlength: 1, required: true },
    mandatory: { type: Boolean }
  }, { discriminatorKey: 'kind', _id: false })

  ForumSchema.add({
    topicsCustomAttrs: [AttrSchema]
  })

  const topicsCustomAttrs = ForumSchema.path('topicsCustomAttrs')

  topicsCustomAttrs.discriminator('Number', new Schema({
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 32 }
  }, { _id: false }))

  topicsCustomAttrs.discriminator('String', new Schema({
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 128 }
  }, { _id: false }))

  topicsCustomAttrs.discriminator('Enum', new Schema({
    options: [{
      name: { type: String, maxlength: 128, minlength: 1 },
      title: { type: String, maxlength: 128, minlength: 1 }
    }]
  }, { _id: false }))

  topicsCustomAttrs.discriminator('Boolean', new Schema({}, { _id: false }))
}
