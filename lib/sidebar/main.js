/**
 * Module dependencies.
 */

import Sidebar from './sidebar.js';

/**
 * Create sidebar instance
 */

var sidebar = new Sidebar;

// Render sidebar
sidebar.appendTo('aside.nav-proposal');

/**
 * Expose sidebar instance
 */

export default sidebar;