import config from 'config'
import mongoose, { Schema } from 'mongoose'
import regexps from 'lib/utils/regexps'

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  locale: { type: String, enum: config.availableLocales },
  email: { type: String, lowercase: true, trim: true, match: regexps.email },
  emailValidated: { type: Boolean, default: false },
  profiles: {
    facebook: { type: Object }
    // Add more profile providers here, like:
    // twitter: { type: Object }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  profilePictureUrl: { type: String },
  disabledAt: { type: Date }
})

export default UserSchema
