/**
 * Module dependencies.
 */

import config from '../config/config.js';
import t from 't';
import { help } from './';


/**
 * Load localization dictionaries to translation application
 */

help(t);

/**
 * Init `t` component with locale as `es`
 */

t.lang(config.locale);