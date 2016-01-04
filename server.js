/**
 * Module Dependencies
 */

import api from 'api'
import 'colors'
import debug from 'debug'
import express from 'express'
import site from 'site'
import mongoose from 'mongoose'
import { needsMigration } from './migroose'

const app = express()
const log = debug('democracyos')
const PORT = process.env.PORT || 3000

app
  .use('/api', api)
  .use('/', site)

function start() {
  app.listen(PORT, (err) => {
  if (err) return log(`❌ Failed to start DemocracyOS due to error: ${err}`)
  log(`🚀 App started at port ${PORT}`)
  })
}

mongoose.connect('mongodb://localhost/DemocracyOS-dev', function(err) {
  if (err) {
    throw err;
  }

  needsMigration((err, migrationRequired) => {
    if (err) {
      console.error(err);
    }

    else if (migrationRequired) {
      console.log('Database migration required'.red);
      console.log('Ensure you backup your database first.');
      console.log('');
      console.log(
        'Run the following command: ' + 'npm run migrate'.yellow
      );

      return process.exit();
    }

    start();
  });
})