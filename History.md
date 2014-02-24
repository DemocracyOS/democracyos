
0.3.4 / 2014-02-24
==================

 * Fix component build process - exit on error
 * Fix use `package.json` version for bin/dos

0.3.3 / 2014-02-24
==================

 * Fix handling of component build errors

0.3.2 / 2014-02-13
==================

 * Refactor i18n for 'comments' to 'arguments'. Closes #263

0.3.1 / 2014-02-13
==================

 * Fix click on home logo. Closes #262

0.3.0 / 2014-02-13
==================

 * Refactor `laws-filter` for `sidebar` #219
 * Add check to voted laws in sidebar list. Closes #226
 * Fix some typos reported by users
 * Fix i18n for 'or' in 'login required' messages
 * Add count numbers to status filters. Closes #238
 * Update 'Hide voted' translation
 * Add i18n for release #255
 * Fix styles for release #255
 * Rename `sidebar-list` to `sidebar` and inner component files
 * Add styles for #220 and #218
 * Add hide-voted checkbox functionality to filter view. Closes #220
 * Add warning for no IE 9- support
 * Finish open/closed filter for #220
 * Fix typo on a translation message
 * Fix input fields tabindex attribute
 * Add translations to link to signup from /signin page. Closes #248
 * Add link to signup #248
 * Add `firstName` and `lastName` translations and remove the ones for `fullName`
 * Refactor `fullname` into two separate fields (`firstName` and `lastName`)
 * Refactor `sidebar-view` into subviews `list-container` and `filter-container`
 * Rename `list-block.jade` to `sidebar.jade`
 * Add store server support routes to `boot`
 * Add new local storage component `store`
 * Add styles file for #218 and #220
 * Fix translation key
 * Add use of new `laws` local component for `siderbar-list`
 * Add new `laws` collection component
 * Fix translations for #218 and #220
 * Add basic UI (no styles) for #218 and #220
 * Add toggle button group for #218 and #220

0.2.9 / 2014-01-30
==================

 * Add support for inheritance locals merge at render

0.2.8 / 2014-01-30
==================

 * Bump merge-util version

0.2.7 / 2014-01-30
==================

 * Remove json build script forgotten require

0.2.6 / 2014-01-30
==================

 * Improve `build` logging
 * Remove deprecated `json.js` builder plugin
 * Improve `jade` build script
 * Add toggle/hide signin/signup links on header. Closes #136
 * Add logs using `utils.pluck` helper method.

0.2.5 / 2014-01-28
==================

 * Restore participants ids on law article view

0.2.4 / 2014-01-28
==================

 * Apply exposure function to filter content delivered to client by API endpoints
 * Fix random bug on responses without body for `comments-view`
 * Rename `utils.map` to `utils.expose`
 * Deprecate `utils.merge` in favor of `merge-util`

0.2.3 / 2014-01-28
==================

 * Fix dependency override of `component/delegate` by `component/tip`. Closes #233

0.2.2 / 2014-01-27
==================

 * Bump `component/events` to 1.0.5

0.2.1 / 2014-01-27
==================

 * Update `utils.restrict` function middleware
 * Remove `/citizen/all` API endpoint. Closes #236
 * Add reject no `application/json` requests from `delegation`, `comment`, `tag`, `proposal`, `law`, `citizen` API endpoints. Closes #237
 * Add `accepts` new module
 * Remove path '/auth/facebook' from page's routes at `boot`
 * Fix error on vote click while unlogged
 * Update to component/events@f445d
 * Pin all component dependencies. Closes #231
 * Bump `component-builder` and `component`
 * Update `config` logs and avoid exposing configuration settings to output
 * Update Makefile
 * Update dependency 't-component' to 1.0.0

0.2.0 / 2014-01-10
==================

 * Fix upvote/downvote comments at `law` article view
 * Remove `border` styles from header's user nav dropdown
 * Fix profile name input validations and rules. Fixes #221
 * Bump mongoose-gravatar to 0.2.1
 * Add default values for gravatar at `citizen`
 * Bump mongoose-gravatar to 0.2.0
 * Profile uses citizen.gravatar instead of .avatar
 * Disable changing email via `settings-profile`. Fixes #223
 * Add missing translations at `settings` page. Closes #214
 * Fix style for active selection in `settings` nav-bar. Closes #201
 * Update translations for `settings` page. Closes #202
 * Add a map of JSON response at `citizen` API endpoint
 * Add a map of values for delivered API documents at `law` API endpoint
 * Update all uses of old `citizen.avatar` to use new `citizen.gravatar`
 * Add `mongoose-gravatar` for `citizen` model to handle dynamically gravatar.com urls
 * Add `pluck`, `map`, `get` and `normalize` at `utils`
 * Remove all tokens of same scope when creating new one at `db-api:token`
 * Add log on error if citizen not found by email and return false at `db-api:citizen`
 * Add link to change avatar at `settings` page. Close #201
 * Update `settings` page's render handle to improve performance
 * Update `settings` page styles and elements
 * Update dependencies and pin versions at `package.json`
 * Add config module to retrieve `mongoUrl` in all modules requiring it
 * Remove `express.router` from `setup`
 * Remove unnecesary application settings at `setup`
 * Move all API modules to `boot` instead of `index.js` for coherent application booting
 * Update code style in some modules to embrace our own standard. Needs more work
 * Update application config settings load. Moved to new `setup` module
 * Update `laws.json` fixtures
 * Fix bug with scroll at section `#content`
 * Update settings page to handle separately `profile` and `password` edits

0.1.1 / 2013-12-31
==================

 * Pin deps to avoid installation crashes

0.1.0 / 2013-11-21
==================

 * Add basic account information update form.
 * Add law time scope and results after close.
 * Add basic commands like: `fixture load`, `db-dump`, and more...
 * Add I18n for client and server.
 * Add IE8 basic support.
 * Add support via UserVoice.
 * Add tag filtering.
 * Add flag as spam for comments.
 * Add upvoting/Downvoting comments.
 * Add comments for laws.
 * Add voting for laws.
 * Add social sharing for Twitter, Facebook and Google+.
 * Add responsive design.
 * Add password reset.
 * Add account email confirmation.
 * Add local Signin/Signup.
 * Add basic application layout.
