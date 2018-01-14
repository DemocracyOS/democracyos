// This file serves as the entrypoint to all configuration loaded by the
// application. All defaults are assumed here, validation should also be
// completed here.

require('dotenv').config()

// ==============================================================================
//  CONFIG INITIALIZATION
// ==============================================================================

const CONFIG = {
  MONGO_URL: process.env.DEMOCRACYOS_MONGO_URL,
  PORT: process.env.PORT || '3000'
}

// ==============================================================================
//  CONFIG VALIDATION
// ==============================================================================

if (process.env.NODE_ENV === 'test' && !CONFIG.MONGO_URL) {
  CONFIG.MONGO_URL = 'mongodb://localhost/test'
}

module.exports = CONFIG
