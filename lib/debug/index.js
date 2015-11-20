/**
 * Module dependencies.
 */

import config from '../config/config';
import debug from 'debug';

/**
 * Initialize debug
 */

debug.disable();

if ('*' === config.clientDebug) {
  debug.enable('democracyos:*');
} else if (config.clientDebug) {
  debug.enable(config.clientDebug);
}

export default debug;
