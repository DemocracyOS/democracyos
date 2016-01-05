import { Schema } from 'mongoose'
import validators from 'mongoose-validators'

const { ObjectId } = Schema

const LinkSchema = new Schema({
  text: { type: String },
  url: { type: String, validate: validators.isURL({ skipEmpty: true }) }
})

const VoteSchema = new Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  value: { type: String, enum: ['positive', 'negative', 'neutral'], required: true },
  createdAt: { type: Date, default: Date.now }
})

const TopicSchema = new Schema({
  title: { type: String, required: false },
  forum: { type: ObjectId, ref: 'Forum', required: false },
  summary: { type: String, required: true },
  author: { type: String },
  authorUrl: { type: String, validate: validators.isURL({ skipEmpty: true }) },
  source: { type: String, validate: validators.isURL({ skipEmpty: true }) },
  votes: [VoteSchema],
  participants: [{type: ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  closingAt: { type: Date },
  publishedAt: { type: Date },
  deletedAt: { type: Date },
  votable: { type: Boolean, required: true, default: true },
  bodyTruncationText: { type: String },
  links: [LinkSchema]
})

export default TopicSchema
