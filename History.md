
0.8.1 / 2014-09-18
==================

 * Fix Makefile building the app as well as post-install script
 * Update dependencies for closest non-deprecated version. Closes #431
 * Fix translations

0.8.0 / 2014-09-16
==================

 * Add citizen profile picture as a URL
 * Add external links to a law
 * Add custom text to truncate law clauses
 * Add unvotable laws
 * Remove 'source' as a required law attribute

0.7.6c / 2014-09-11
==================

 * Fix create law

0.7.6b / 2014-09-05
==================

 * [sidebar] - Fix path to check.png image

0.7.6 / 2014-09-05
==================

 * Add navigate back to /law/:id after succesful signin. Closes #369
 * Update node version to 0.10.28
 * Update npm version to 1.4.9
 * Update to Component(1)
 * Fix English translations
 * Fix signin tabindex

0.7.5 / 2014-08-26
==================

 * Fix spanish translations
 * Add menu items for `faq`, `tos`, `pp` and `glossary`, conditional to settings. Closes #412
 * Add denying user to up/downvote comments if they are not signed in. Closes #403
 * Add translations for 'You must be signed in to up/downvote arguments' #403

0.7.4 / 2014-08-14
==================

 * Add Dutch translations
 * Add German translations
 * Add View and FormView base js classes for all view to extend them and not repeat the same logic through all the app
 * Add Stateful and StatefulView components to handle view states
 * Add autosubmit and autovalidate for forms
 * Add SideComments, but comment it out
 * Add CONTRIBUTORS file
 * Add MIT License text
 * Update README.md
 * Remove trailing whitespaces
 * Fix environment variables for FAQ, Terms of Service, Privacy Policy and Glossary enabling
 * Fix email validation flow to redirect to the topic the user was reading before signup
 * Fix 'Guest' displayed to logged in user as their fullname
 * Fix SignUp bug on Firefox

0.7.3 / 2014-07-12
==================

 * Fix not showing page content once page changes having no laws. Closes #385

0.7.2 / 2014-06-23
==================

 * Add 'for' attribute on 'hide-voted' label
 * Add app stats for admin users #377
 * Add `#content` lock until page is rendered #183
 * Add setting `emailValidated` to true when signup in 'development' environment. Closes #374
 * Add optional text-centered law clauses from the admin #197
 * Add disclaimer when sidebar has no law to select #355
 * Add strip package. Closes #334
 * Add README.md stub
 * Add glossary #371
 * Add layout as a separate module #86
 * Update default logo and favicon URL in config
 * Update `clauseId` to be non-required `clauseName` #304
 * Update `sidebar` to hide 'closing-soon' filter when seeing only closed laws #368
 * Update  with link for Christian Martínez
 * Update voting to prevent reloading the page. Closes #367
 * Update 'discore/closest' to 'component/closest'
 * Fix counter label when there are +99 open/closed laws
 * Fix anchor colors to be consistent all the way across the app. #375
 * Fix typo on snapper destroy
 * Fix participants to be ordered by voted date #339
 * Fix `read more` links on comments #361
 * Fix law articles bold color links #354
 * Fix zoom on mobile (make it un-zoomable) #364
 * Fix dropdown on all browsers
 * Fix header race condition #325
 * Fix facebook and twitter cards, escaping HTML characters
 * Fix open and closed count as they were counting drafts if you were signed in as admin. Closes #342

0.7.1 / 2014-05-30 
==================

 * Remove 404 not found page

0.7.0 / 2014-05-29 
==================

 * Add 404 not found page
 * Add support for FAQ, Terms of Service and Privacy Policy pages
 * Add 'My argument' section
 * Add disable up/downvoting own comments
 * Add sorting comments
 * Add an 'edited' label next to a comment when it was edited
 * Add spinner for loading comments
 * Update proposal-article to auto-scale iframes (i.e.: youtube embedded videos)
 * Fix timepicker in the law admin
 * Fix logout bug
 * Fix sidebar voted laws bug #336
 * Fix proposal-article image size on mobile
 * Fix transportation tag image issue
 * See migrating to 0.7.x

0.6.7 / 2014-05-16 
==================

 * Comments are marked as spam when they exceed a config parameter or, if not set, when they have more spam reports than score (upvotes minus downvotes)

0.6.6 / 2014-05-14
==================

 * Fix cannot set 'transport' image to a tag. Closes #347

0.6.5 / 2014-05-13
==================

 * Fix embedded image in proposal size to match the proposal's width

0.6.4 / 2014-05-13
==================

 * Remove unneeded remotes from root `component.json`

0.6.3 / 2014-05-12 
==================

 * Fix build failure based on remotes. Change remotes order.

0.6.2 / 2014-05-09 
==================

 * Fix comments paging and sorting

0.6.1 / 2014-05-09
==================

 * Fix several translation errors

0.6.0 / 2014-05-07
==================
 * Add 'fi' locale (Finnish)
 * Add deleting and editing own arguments
 * Add replying to an argument
 * Add markdown'd arguments
 * Add markdown explanation page
 * Add locale config parameter
 * Add comments paging
 * Fix component issue
 * Fix some UI issues
 * Fix npm packages dependencies, changing ^ for ~

0.4.12 / 2014-04-25
==================

 * Fix build failure based on remotes and outdated component version

0.4.11 / 2014-04-14
==================

 * Fix 'voted' check after sign-in. Fixes #326

0.4.10 / 2014-04-03 
==================

 * Refresh sidebar after casting vote
 * Fix not showing form errors on FF
 * CSRF protection

0.4.9 / 2014-03-31
==================

 * Remove requirement of feedback. Closes #303
 * Update translations
 * Update `README.md` with current deployments.
 * Remove references to Partido de la Red.
 * Update article template and config so alert is optional.
 * Update default fixtures
 * Change default locale to 'en'
 * Update header background color
 * Add list alphabetically sorting. Closes #299
 * Merge pull request #302 from Magui1984/development
 * Create fr.json
 * Add timepicker for closingAt law attribute. Closes #300
 * Add styles to override bootstrap default css that was making datepicker popover invisible #300
 * Add datepicker control and clear button
 * Add field for closingAt date #300
 * Add component/datepicker dependency
 * Add translations for  #300
 * Bump slifszyc/paragraphs to 0.2.0 version
 * Update application configuration by adding `dos-config` command. #234
 * Merge pull request #297 from rodowi/storage-quota-fix
 * Overcomes local storage quota
 * Fix update for #293
 * Fix suscribe ListView to LawsFilter items `reload` event instead of `change`
 * Remove refetch on citizen loaded. Fixes #293
 * Fix overflowed selected filter in Firefox. Closes #270
 * Fix law min-height for voted badge. Closes #294
 * Update `sample.json`

0.4.8 / 2014-03-31 
==================

 * Add published laws RSS feed

0.4.7 / 2014-03-20 
==================

 * Add `closingAt` law attribute on admin

0.4.6 / 2014-03-18 
==================

 * Fix comments at law view rendering bumping slifszyc/paragraphs to 0.2.0 version

0.4.5 / 2014-03-13
==================

 * Fix unescaped comments at law view

0.4.4 / 2014-03-10
==================

 * Fix firefox bug on function scopes at `laws-filter`

0.4.3 / 2014-03-06
==================

 * Move `homepage` centrilized styles to each component and `boot`
 * Deprecate `main.css`
 * Fix missing `var(spacing)`
 * Add `styl` compiler at `build` and normalize `main.styl` at `homepage` to match `styl` instead of `stylus`

0.4.2 / 2014-03-03
==================

 * Refactor `settings` and `admin` sections
 * Add `publishedAt` to several `law`s in `lib/fixtures`. Closes #289
 * Add missing keys to `ca.json` locale translation file. Requires translation
 * Added Catalonian translation file

0.4.1 / 2014-02-28
==================

 * Fix feedback initialization with new header. Fixes #290
 * Update citizen middlewares for client. Improve login/logout
 * Fix unexpected bug on filtering voted laws
 * Fix snapper with new header

0.4.0 / 2014-02-28
==================

 * Fix to re-fetch laws after login
 * Fix  sort in `sorts` to use `publishedAt` field instead of `createdAt`. Closes #287
 * Change state to loading while fetching tags
 * Refetch laws after save/delete law from `admin` pages
 * Change state to loading while fetching laws
 * Re-fetch laws after save/remove from `admin` pages
 * Updated staff client middleware. Closes #286
 * Add public/private status update and delete law with confirmation. Closes #242 #280
 * Add `publish`, `unpublish` and `delete` API endpoints. #242
 * Update queries to only display undeleted laws
 * Bump bootstrap to 3.1.1
 * Fix site reload on login. Closes #283
 * Update endpoint to serve only public laws unless user is staff
 * Add `publishedAt` and `deletedAt` fields. Remove unused `deleted` field
 * Update images to global international naming
 * Update tag image url source from `tag-images` collection
 * Add `tagImages` as a global var for templates
 * Remove moved tag images from component.json
 * Update form to allow image selection for tags. Closes #278
 * Update force tags section as part of `List` at sidebar
 * Add image key of tag for laws all population
 * Provide image key from tag API endpoint #278
 * Add image key to model tag #278
 * Refactor collection of `tag` images as a module
 * Fix sidebar not being sensitive to citizen logout. Closes #274
 * Add translations for admin sections. Closes #281 #279 #277 #276 #275
 * Add force list section on sidebar for law edit view
 * Add summary field to form and fix tabindex and options selected query
 * Add common styles for admin sections
 * Update `README.md` with team categories
 * Add confirmation dialog styles
 * Update pre-delete clause modal message and dont focus on cancel
 * Add basic confirmation alert before deleting a clause
 * Update styles for list view for admin lists
 * Refactor logout to use a middleware. Closes #273
 * Add redirect to `/signin` after logout #273
 * Refactor logout to use new `logout` component #273
 * Add `logout` component #273
 * Update list view. Add remove clause method and mechanics.
 * Add remove clause endpoint
 * Update method .update to properly update 1 by 1 law clauses with new content
 * Parse clauses input names before sending on POST request
 * Refactor header into independent component. Closes #265
 * Add simple clauses creation mechanics
 * Add clause API endpoint method to create/update law clauses
 * Update `CONTRIBUTING.md` with contribution workflow. Thanks @maraoz!
 * Add unescaped summary to display law with line breaks. Closes #196
 * Add form disabling when posting signin data. Closes #199
 * Remove normalize module dependencies from tag model. Closes #264
 * Add tag hash normalization when creating a new tag. For existing tags, hash should not be changed as it is used to fetch their image #264
 * Add normalize function to utils and rename old normalize function to sanitaze #264
 * Remove deprecated functions #264
 * Add utils to tag model #264
 * Add create and edit tag server side endpoints #264
 * Add tag create and edit client endpoints
 * Add form-view and template to edit/create a tag #264
 * Add tags admin to list existing tags #264
 * Add tags list rendering inside content #264
 * Add tag list and create options #264
 * Add new method `.update(id, data, fn)` to `db-api` for `law`
 * Add restrict and staff middlewares for /law/:id POST endpoint
 * Add /law/create and /law/:id POST endpoints for admin law edition
 * Add /tag/all endpoint
 * Add self binding for middleware usage
 * Update middleware build check
 * Update sections with placeholder for new sections format. #240
 * Update client routing to match chained sections of admin pages. #240
 * Add `staff` config key from environment. Closes #241
 * Add staff middleware check for `/law/create`. #241
 * Add `isStaff` middleware check #241
 * Add `staff` virtual property to model `citizen` #241
 * Add `staff` prop to sample.json. #241
 * Add administration module

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
