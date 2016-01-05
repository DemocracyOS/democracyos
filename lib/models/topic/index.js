import mongoose from 'mongoose'
import TopicSchema from './schema'

export default mongoose.model('Topic', TopicSchema)
