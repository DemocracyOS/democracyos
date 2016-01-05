import { Schema } from 'mongoose'

const TopicSchema = new Schema({
  summary: { type: String, required: true }
})

export default TopicSchema
