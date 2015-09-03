
1.0.0-rc / 2015-09-03
=====================

  * Add Code of Conduct for Open Source projects. Close #695
  * Bump notifier version
  * [forum-middleware] - Redirect to home if no forum is found #1031
  * [forum] - Move delete feeds logic to db-api:forum #1031
  * add correction by @elephantsy
  * Added CodeClimate badge
  * use config.availableLocales instead of l10n/supported
  * Add Albanian (sq) to defaults.json
  * Add albanian option on settings
  * translate missing keys on Albanian
  * remove untraslated keys from sq.json
  * use ISO-639-1 code for Albanian translation
  * Create al.json
  * fix return on bin/dos-translate
  * update google-translate dependency
  * fix dos-translate deleteKey command
  * add delete-repeated-values on dos-translate
  * [forum] - Remove related feeds when removing forum #1031
  * Update deprecated app.del(...) --> app.delete(...)
  * [forum] - Update forum name regexp to accept uppercase, though it is lowecased then
  * [logo] - Fix logo on desktop version
  * [translations:es] - Add missing translation
  * rename availableTranslations -> availableLocales #958
  * [translations] - Remove dynamic approach. Replace it for a config variable for available translations. Closes #958
  * fix default options
  * add nodemailer configuration for notifier
  * Fetch forum topic and fixed comment-reply URL. Closes #1027
  * [api:comment] - Remove avatar field. Rewrite fields on select #1023
  * Fixed queries not fetching profilePictureUrl. Closes #1023
  * Add tracking events for 'create forum' and 'delete forum'
  * Removed old clauses references. Closes #900
  * [config] - Add spamLimit to client config. Close #1021
  * Bump marked and express versions due to security issues
  * Fix badges layout
  * Add david badge to README.md
  * fix whitelisting menu on admin
  * remove unused dependency
  * Remove side-comments dependency from Github #819
  * Remove wrap dependency from Github #819
  * Remove timeago dependency from Github #819
  * Remove toggle-parent dependency from Github #819
  * Remove toggle dependency from Github #819
  * Remove quill dependency from Github #819
  * Remove loading-lock dependency from Github. Fix list.js #819
  * Remove list.js dependency from Github #819
  * Remove headroom.js dependency from Github #819
  * Remove ga dependency from Github #819
  * Remove emitter dependency from Github #819
  * Remove datepicker dependency from Github #819
  * load embebed notifier when neccesary
  * change config.notifications.notifier -> config.notifications.url
  * move /forgot route before visibility check
  * Remove confirmation-component dependency from Github #819
  * Remove component-tip dependency from Github #819
  * dont add default ports to urls Closes #876
  * Remove Snap.js dependency from Github
  * fix forum create form errors css Closes #897
  * fix google fonts urls
  * fix styles on topic form Closes #729
  * fix singin form error styles #729
  * fix forums/exists response on forum-api Closes #915
  * fix error handling of forum-api create response #915
  * add reserved name validation on forum model #915
  * [config] - Add organizationEmail config parameter
  * [notifier] - Add organizationName parameter
  * fix boot-responsive.styl
  * use headerFontColor on mobile menu icon
  * show original names for languages Closes #963
  * delete extra keys on translations
  * sort language files
  * fix dos-translate library
  * Bump notifier version
  * Update README.md Closes #766
  * remove vot-it form README.md #766
  * Fixed gap between first and second paragraph
  * Sort clauses after update
  * fix vars definitions
  * fix clauses parser when it has no text
  * [translations] - Add polish and traditional chinese to supported languages
  * merge with 1.0.0
  * [translations] - Add traditional chinese
  * [translations] - Add polish translation
  * merge with 1.0.0
  * readd status on topic-api
  * fix eslint warnings
  * remove topic.recount functionality
  * [admin-topics-form] - Fix showing message on success
  * Deleted duplicated code
  * Update side-comments version
  * fix topic delete
  * Fixed bug parsing empty text or one-liners
  * Pinned xss version to 0.2.2
  * Bump notifier version to 0.0.6
  * Fix usage of ObjectIds for notification payload
  * Bump notifier-client dep version
  * [notifications] - Remove unnecesary variable
  * Add embedded notifier option - only supports fogot-password
  * [notifications] - Remove unnecesary variable
  * Pin democracyos/notifier dep to ^0.0.5
  * Fix 'reply-argument' usage and rename to 'comment-reply'
  * Add embedded notifier option - only supports fogot-password
  * Bump notifier version to 0.0.6
  * Fix usage of ObjectIds for notification payload
  * [admin-topics-form] Cleanup
  * [admin-topics-form] Cleanup
  * Bump notifier-client dep version
  * clear store cache on login
  * clean stores cache on logout
  * [forum-store] - Fix unset userForum on logout
  * fix sidebar refresh comparison
  * [notifications] - Remove unnecesary variable
  * Pin democracyos/notifier dep to ^0.0.5
  * Fix 'reply-argument' usage and rename to 'comment-reply'
  * Add embedded notifier option - only supports fogot-password
  * [notifications] - Remove unnecesary variable
  * Pin democracyos/notifier dep to ^0.0.5
  * Fix 'reply-argument' usage and rename to 'comment-reply'
  * move segment code to a partial
  * Add embedded notifier option - only supports fogot-password
  * avoid unnecesary sidebar hide
  * [newsfeed] - Fix checking for feed.data before feed.data.user
  * refresh topicStore when topic changes thru admin
  * improve cache handling on store
  * remove unnecesary findAlls
  * [topic-store] - Updae to use topicStore on unpublishing a topic #965
  * merge with 1.0.0
  * fix createFirstTopic button
  * remove node_modules from watchify fix #986
  * add Promise polyfill
  * correclty select first topic on homepage
  * [headroom.js] - Fix headroom.js module dependency. Close #989
  * fix sidebar list reset
  * fix sidebar list refresh
  * normalize keys exposure on topic-api
  * update topicFilter on 'topic-store:update:all' event
  * store: update findAll cache when item is updated
  * fix sidebar topic urls
  * [sidebar] - Fix voting a topic
  * fix topic parsing on singleForum
  * fix nanoModal default styles
  * remove unused styles
  * fix admin on singleForum
  * use external findIndex fn
  * fix lib/topic-filter/sorts.js for es5
  * update topic-filter when topic-store items change
  * add topic-filter specific middlewares
  * :art: remove unnecesary '.js' on imports
  * :fire: remove unused lib/topics
  * :fire: remove unused topics-filter
  * use topic-filter/sorts on lib/rss
  * fix html5 polyfills for ios and IEs
  * :racehorse: avoid unnecesary redraws on topics list of sidebar
  * :arrow_up: jquery version
  * :art: list item render on sidebar
  * [db-api:forum] - Fix logging #965
  * [eslint] - Remove unnecesary label instructions #965
  * fix filter order on sidebar
  * fix sorts selector hash
  * merge with 1.0.0
  * add sort filter
  * fix selected item on filter
  * add status filter
  * add hideVoted filter
  * add active topic on sidebar
  * [analytics] - Add analytics wrapper to not always keep asking if it is enabled #791
  * add filter view
  * refactor view/mixin
  * [analytics] - Add 'vote topic' tracking event #791
  * [analytics] - Add tracking events for commenting, upvoting, downvoting and unvoting #791
  * use topicStore to send votes
  * [xss] - Add forceSafeImageURLs config variable. Close #980
  * [richtext] - Fix default font size #937
  * move sidebar-filter styles to its own folder
  * add basic sidebar refactor #965
  * add mixins functionality for composed class extends
  * move global styl vars to a single file
  * [analytics] - Add segment.io to keep track of 'signin', 'signup' and 'logout'. Add keep track of current user as well #791
  * add .dom alias as .domRender to avoid conflicts
  * correctly check for array
  * fix js styleings
  * add immutable topicFilter dependant on topicStore
  * [results-box] - Fix Chart.js rendering. Close #974
  * add forumStore.findOneByName
  * [models:topic] - Remove unused attributes. Close #978
  * add url-builder
  * [api] - Update /api endpoint to be accessible on a browser to see deployment's version and related stuff. Close #940
  * update parse items using promises on store
  * [emitter] - Remove lib/emitter module. Close #913
  * use topicStore for homepage on singleForum #965
  * [admin] - Add font-size on admin toolbar. Close #937
  * use topic store on multiForum homepage #965
  * refactor store findAll
  * [homepage] - Fix showing multiple times the same button. Close #955
  * [translations] - Fix Spanish translations. Closes #970
  * [settings] - Fix delete forum modal for mobile. Closes #959
  * use topicStore on forum Homepage #965
  * :art: js semantic fixes
  * :art: topics-filter
  * fix topicsFilter js styling
  * use topicStore on admin/topics
  * remove debugger statement
  * update stores naming conventions
  * add semicolons on layout
  * Fix buttons default line-height Closes #889
  * update .stylintrc file
  * Fix setting all tags for the TopicForm #950
  * Move publish to topicStore #950
  * refactor hasAccessToForumAdmin declaration
  * enforce js styleguide
  * fix user hasAccess middleware definition
  * fix tag store
  * Fix redirecting to /admin after topic delete #950
  * Updates to adapt to multiForum config var #950
  * Add middlewares for finding one and all topics and tags for admin #950
  * rename config.singleForum -> config.multiForum Closes #966
  * Add link to forum admin on newsfeed homepage #950
  * dont cache allitems on store
  * use new interface everywhere
  * Add securing /api routes #950
  * Fix forum link on edit and create #950
  * allow extra arguments on url
  * improve store.js interface
  * Fix links and selected sidebar item #950
  * Remove admin sidebar singleton #950
  * fix login redirection Closes #964
  * Correct log message
  * Rename ForumSchema.softDelete to ForumSchema.delete
  * fix forum router home
  * fix forum router home
  * merge with add-forum-homepage
  * Add hasAccess middleware on backend #950
  * fix nanoModal reference
  * Add forum soft delete on model and API
  * Fixes singleForum admin #950
  * Add admin topic list #950
  * fix forum delete
  * Merge with delete-forum #950
  * fix forum delete modal
  * Add topic store #947
  * Add all method on store #947
  * add forum delete #946
  * Starting with forum admin #950
  * add forum delete form
  * fix store.js destroy method
  * add forum delete api
  * fix topic show on singleForum
  * fix javascript writing on db-api/topic
  * [forum-router] Fixed default route #947
  * [topic] Improved migration logic #482
  * fix db-api/topic.get id validation
  * simplify response
  * fix log sentence
  * [topic:migration] Added v1 side comments migration logic #482
  * [migrations:topic] Changed the way we migrate side-comments #482
  * show first topic of forum as forum homepage Closes #947
  * [migrations:topic] Refactor #482
  * [migrations:topic] Added some comments #482
  * Deleted migration script CLI #482
  * [topic] Moved migration logic to Topic API #482
  * add forum homepage route #947
  * rename router -> forum-router and forum -> forum-new
  * fix routes definition order
  * [topic] Migration script #482
  * rename Forums -> ForumStore
  * rename RemoteModel -> Store
  * rename lib/store -> lib/storage
  * fix unload user forum when logout occurs
  * [translations:es] - Add missing translations for newsfeed
  * [newsfeed] - Compare to err.status instead of err.message #944
  * Bumped component-dom version to 1.0.8
  * [dependencies] - Bump component-dom to 1.0.8 #944
  * [forum-row] - Update 'alert' for a 'console.log' #944
  * add comments on new classes
  * Bumped component-dom to 1.0.8. Fixes broken build
  * rename RemoteModel.delete to .destroy
  * rename Collection to RemoteModel and remove Symbols
  * add forums collection and implement it Closes #944
  * bump deps that threw warnings on build
  * rename Collection.load() -> get()
  * Fix collection interface
  * add forums collection
  * [models:topic] Changed clauseTruncationText to bodyTruncationText #901
  * remove unused dependencies
  * Fixed broken translations
  * [richtext] Added more logging
  * [admin-topic-form] Removed clauses from form
  * fix forum loading
  * [body-serializer] Prevent duplicating videos
  * [topic] Add empty flag to clauses to prevent sidecommenting them
  * [proposal-article] Make embedded videos responsive
  * [proposal-article] Fixed broken side comments of first paragraph when Show More has been clicked
  * [topic-api] On updating a topic, delete non-submitted clauses
  * [topic-api] Serve topic clauses sorted
  * [body-serializer] Embed responsively videos when converting to HTML #482
  * [proposal-article] Removed unused imports #482
  * [proposal-article] Cleaned up view #482
  * [proposal-article] Fixed side comments for summary (first paragraph) #482
  * [topic-api] Consolidated regular and side comments request payload. Closes #576
  * [proposal-clauses] Unified kinds of side comments #482 #935
  * [body-serializer] Deleted unused function #482
  * [body-serializer] Changed data attribute to match the one SideComments needs #482
  * [body-serializer] Fixed bug on converting to HTML only one paragraph #482
  * [body-serializer] Properly deleting HTML attribute #482
  * [topic] Fixed updating topic clauses. Added position field. #482
  * [body-serializer] Added logging #482
  * [debug] Fix client side logging
  * [topic] Refactor #482
  * [richtext] Add logging
  * [topic] Made object serializer compatible with non-array instances #482
  * [proposal-article] Fixed topic visualization with the new data format #482
  * [build] - Remove browser transformation. Closes #918
  * Fix 404ing some pages
  * [topic] Added Paragraph Schema and fixed Topic serializer #482
  * remove debugging variable
  * [admin-topics-form] Render clauses in body textarea #482
  * fix duplicated config
  * [topic] Added client-side topic body serializer. Deleted body field and changed clauses field type #482
  * Add forum model for frontend Closes #911
  * [admin-whitelist] - Fix whitelist list and form. Closes #908
  * [emitter] A fixme comment
  * Fix js standars
  * Add forum model middleware Closes #911
  * fix linter errors
  * syntactic fixes
  * [fixtures] Renamed summary field to body in sample data #901
  * [topic] Renamed summary field to body as long as its references #901
  * Comply with js standars
  * merge with add/forum-model
  * Added GMail/YahooMail address aliases handling #689
  *  [forum-model] - Add basic forum model #911
  * fix db-api/forum initialization
  * [forum-model] - Add basic forum model #911
  * dont use colons on stylint
  * Dont show law title on homepage
  * Fix var naming
  * [build:js] Fixed variable collision
  * Remove feedback component. Closes #359
  * [build] Fixed build task non-exiting
  * [newsfeed] - Fix typo. Closes #892
  * Fix new forum form Closes #825
  * Improved ESLint configuration #247
  * [build:js] Added linting to modified files on watch task #247
  * [newsfeed] - Add button to take the user to their forum or to craete one #892
  * [build:lint] Added ESLint configuration file #247
  * [build] Added ESLint #247
  * [build:lint] Removed JSHint #247
  * [styles] Added tip and datepicker dep CSS. Closes #865
  * [settings-password] Handling incorrect password on view #668
  * [settings-api] Changed response code when password is incorrect #668
  * Pin npm engine version
  * Fixed Node version in 0.12.4
  * [styles] - Remove support for IE8. Closes #816
  * [build] Fixed gulpif and livereload hanging build task
  * Merge with development
  * Renamed singleDemocracy config key to singleForum #800
  * [auth-facebook] Fixed misuse of addClass method #800
  * [auth-facebook] Renamed styl file 800
  * Merge with development
  * Fix auth-facebook styles
  * Fix facebook login form
  * [build:css] Added livereload to the build pipeline #872
  * Merging against 1.0.0 #800
  * Bumped Node engine version to 0.12
  * Bumped Node engine version to 0.12
  * Made run target depending on build
  * [build:settings] Added livereload as a parameter. Closes #872
  * [build:js] Added livereload to the browserify pipeline #872
  * Added gulp-livereload as dep #872
  * [build] Fixed make default target broken after updated gulp tasks
  * [newsfeed] - Fix double redirecting to homepage after signin #800
  * [side-comments] Fixed avatar visualization. Closes #883
  * [boot] [side-comments] Set styles for new fonts. Closes #366
  * [layout] Fetch fonts from Google Fonts #366
  * normalize style files names Closes #797
  * [boot] Removed Typekit #366
  * [feeds] - Add forum reference to topic model #800
  * [build] Added 'bws' task
  * [build:js] Fixed watchify not rewriting app.js
  * [citizen] - Add missing translations to remove 'citizen' completely. Closes #480
  * [citizen] - Removing citizen references. Missing translations files #480
  * [logout] Made logout synchronous #846
  * [citizen] - Starting to rename to user #480
  * [proposal-article] - Add tweetText env variable, fallbacks to topic's mediaTitle. Closes #742
  * [citizen] Made logout asynchronous #846
  * [signup] - Fix missing space. Closes #853
  * [signin] Added signout endpoint and made session cookie httpOnly #846
  * Revert "[models:law] Removed URL validation in model-tier #834 #840"
  * [validators] Added support for accented characters in URLs. Closes #840
  * [regexps] Added support for ':' character in URLs. Closes #834
  * [models:law] Removed URL validation in model-tier #834 #840
  * [models] Reverted #813.
  * [newsfeed] - Fix loading spinner #800
  * [comment-card] Fixed removal confirmation box overflow. Closes #850.
  * Bumped side-comments to v0.0.18
  * [topic] Renamed entity Law to Topic. Also renamed file and directory names. Closes #481
  * [newsfeed] - Update body background color #800
  * [package.json] - Update gulp path on npm scripts #845
  * [build:serve] Fixed DEBUG env var passed to child process #845
  * [logout] - Fix redirect after logout
  * [newsfeed] - Update styles #800
  * [build:css] Refactor #798
  * [build] Added gulp 'build' task #798
  * [build] Added 'build' target #798
  * [build] Updated npm scripts #798
  * [build] Cleanup #798
  * [build] 'run' target executes gulp 'watch' task #798
  * [build] Rewritten log and settings #798
  * [build] Made serve task non-dependent on watch but watch task dependent on serve #798
  * [build] Use gulpif to determine if the build is for production
  * [build] Make settings sensitive to process arguments
  * [newsfeed] - Add comment feed card #800
  * [newsfeed] - Add call to action footer on card #800
  * [build] Refactor #798
  * [sidebar] - Add forum name to sidebar item link #800
  * [build] Added watchify #798
  * [newsfeed] - Add link on card title #800
  * Removed unused packages #818
  * [build] Removed component(1) #818
  * [settings] - Add /settings/forums on server side #826
  * [newsfeed] - Update to include some more fields on the newsfeed card #800
  * [settings-forum] Fixed modal styles #824
  * [forum] Added translations and fixed style names #824
  * [forum] Forgotten  #826
  * [forum] Fixed setting status bug #826
  * [render] Fixed function exposure bug #826
  * [settings:forum] Added Forums section to Settings #826
  * [forum-api] Added delete method #826
  * merge with development
  * [feed-card] - Starting with feed card #800
  * [feed] - Add basic feed model, api and endpoint #800
  * [feed] - Starting with feed model #800
  * [newsfeed] - Add newsfeed basic layout #800
  * Merge with development
  * [user] Unified avatar field
  * [forum-api] - Update /forums --> /api/forum URL #814
  * [forum] - Update styles and texts for validations and form label #814
  * [forum] Fixed check for forum uniqueness #814
  * [forum] Renamed democracy to forum #814
  * Cleanup merge #799
  * [signup] - Fix reference link on signup #799
  * [build:js] Made shorter Browserify errors
  * [democracy] Added database binding to Create Democracy feature #814
  * [democracy] Added Democracy model, endpoints and New view #814
  * [build] Better gulp patterns and verbosity
  * [model] Renamed entity: Deployment to Democracy #801
  * Add missing 404 styles
  * Starting to separate /law/:id from /:democracyName/law/:id #799
  * [models] Drop User database support. Closes #813
  * [models] Added Deployment schema and a reference in Law schema. Closes #801
  * Merge github.com:DemocracyOS/app into 1.0.0
  * [visibility] Rewrote in ES6 and fixed import paths
  * Update Makefile and Gulpfile
  * [flaticons] - Fix flaticons fonts
  * Fix logout
  * Add missing styles
  * Add missing styles
  * Add datepicker component
  * [confirmation] - Add confirmation component and start decoupling boot.styl
  * [build:serve] Fixed coloured debug output
  * [build] Refactor and cleaning up
  * Deleted component.json and assets in old locations
  * Changed public assets references
  * [flaticons] Moved files to assets subdir
  * Merged package.json
  * [tag] Moved tag-images to tag/assets directory
  * [build] Improved build chain
  * [build] Added 'clean' task
  * [404] Fixed bad invoking to render.dom
  * [build:assets] Fixed 'assets' task
  * Fix side comments dep
  * Fixed side-comments endpoint
  * Fixed side-comments endpoint
  * [build] Added assets task to the build chain
  * [build:assets] Fixed subdirectories issue
  * [build] Added 'assets' gulp task
  * [admin-law-form] - Add toggle button
  * [proposal-clauses] Deleted forgotten comment
  * [404] Rewrote in ES6
  * [settings] Enabled toggle buttons
  * Fixed comment-card bug
  * Fixed side comments
  * Merge
  * [translations] - Fix translations booting on browser
  * [title] - Fix title dep reference to local one
  * [boot] - Fix page to properly bind to click events, as we now support real browsers and IE +10, #135 is no longer valid so we can remove the click option on page.js
  * Add admin pages
  * Added watch task for .js, .jade and .styl files
  * Downgraded page to 1.3.7
  * Refactor and cleanup
  * Refactor
  * Changed some JSHint rules
  * Rewrote help module
  * Add markdown transform
  * Rewrote settings module, except settings-notification toggle feature
  * Merge with origin/HEAD
  * Rewrote forgot module
  * Rewrote signup module
  * Bug fixing
  * Rewrote signin module
  * Bug fixing
  * Temporarily disabled SideComments references
  * Fixed render#dom importing and invoking
  * Don't build the template in the constructor of View class
  * Fixed bugs in sidebar
  * Made Browserify errors more verbose
  * Fixed runtime errors after rewrite law module
  * Fixed some syntax errors
  * Rewrote law and its deps
  * Refactored logout
  * Refactored gulpfile
  * Rewrote homepage
  * Added jshint and stylint config files
  * Fixed some ES6 tricky parts on header and deps
  * Fixed broken deps
  * Referenced some packages to GitHub repos
  * Rewrote header
  * Updated content-lock
  * Rewrote content-lock
  * Added gulpfile to build with browserify. Rewrote lib/boot and lib/body-classes.

0.17.4 / 2015-06-03
===================

  * Fixed bug that didn't ñet signup STAFF members #882
  * Remove DEPLOYMENT_DOMAIN config #873
  * Refresh token when is older than 1 day #874
  * Delete incompatible token cookies #871
  * Implemented httpOnly cookie option and a signout endpoint #846.
  * Added support for ':' character in URLs #834

0.17.3 / 2015-05-27
===================

  * Fix emebed videos on https #859
  * Normalize usage of avatar on user model #854
  * Fixed overflow on remove confirmation box #850
  * Default translations 'en' <- 'config.locale' <- 'user.locale' #828
  * Set user locale on signup Closes #828

0.17.2 / 2015-05-26
===================

  * Update DemocracyOS/side-comments version
  * Fix Law summary html filter #839
  * Set default value null for learnMoreUrl #837
  * Fix logout bug. Sometimes it just didnt work #811

0.17.1 / 2015-05-19
===================

  * Add headerContrast configuration #795
  * Dont remove stylings on law summary #810
  * Fix side comments #807 #759

0.17.0 / 2015-05-18
===================

  * Consolidate TLS/SSL configuration #822
  * Add fallback on missing translation keys with default locale #808
  * Add facebook login/signup form #815
  * Remove privatePort config key #788

0.16.2 / 2015-05-12
===================

  * Fix variable redefinition that causes app to crash in HTTPS mode #803

0.16.1 / 2015-05-12
===================

  * Fix users whitelist configuration #806

0.16.0 / 2015-05-08
===================

  * Improvements on spanish translations #767
  * Add Hungarian translations #793
  * Improvements on french translations #784
  * Now the user can change the app language from settings page #630
  * Improvements on Portuguese translations #779
  * Add App visivility configuration #741

0.15.0 / 2015-04-28
==================

  * Refactor app configuration #762
  * Remove bootstrap.js and dependencies #757
  * Add some parameterizable styles for header #730
  * Add users whitelist #722
  * Update store JWT in cookie at signin #735

0.14.0 / 2015-03-19
==================

 * Add quill support for video and image embedding over https
 * Update gravatar requests to go through https
 * Bump tj/debug version to 2.1.3 since it prevented built
 * Add external settings page. Closes #712

0.13.0 / 2015-03-17
===================

  * Add IP address as domains
  * Fix admin responsiveness. Closes #691
  * Fix buttons position. Closes #708

0.12.15 / 2015-03-16
====================

  * Fix domains in jwt. #706

0.12.14 / 2015-03-16
====================

  * Clear cookie after getting the domain in jwt. #706

0.12.13 / 2015-03-16
====================

  * Fix exporting top level subdomain for jwt. Closes #706

0.12.12 / 2015-03-15
====================

  * Add create tag link if no tags are found before creating any law. Closes #707

0.12.11 / 2015-03-15
====================

  * [jwt] - Update jwt component to look like hub's

0.12.10 / 2015-03-13
==================

 * Add reponsive logo for mobile #699
 * Add create my first topic button for staff members Closes #703
 * Fix new law button on admin
 * Fix new tag button on admin

0.12.9 / 2015-03-12
==================

 * Make '_target' attr conditional to 'homeLink' setting on header org link
 * Revert "Fix organization link to open on same tab"
 * Fix logo link on header Closes #701
 * Fix organization link to open on same tab

0.12.8 / 2015-03-11
==================

 * add deploymentId on feeds

0.12.7 / 2015-03-10
==================

 * update headerBackgroundColor to match hub's

0.12.6 / 2015-03-10
==================

 * update dockerfile description
 * expose client config on layout/index.jade for deployments where the config is part of the release and cannot be built
 * fix header user-badge height #699

0.12.5 / 2015-03-10
==================

 * fix usage of CORS_DOMAINS env variable

0.12.4 / 2015-03-10
===================

  * Fix corsDomains should be a string

0.12.3 / 2015-03-10
==================

 * update client config build logging

0.12.2 / 2015-03-10
==================

 * disable new topic notifications being true by default
 * update default favicon file path

0.12.1 / 2015-03-09
==================

 * externalize `db` module to democracyos-db repo
 * Add bug report template to `CONTRIBUTING.md`

0.12.0 / 2015-03-09
==================

 * make fallback PORT value equal to the one in sample.json
 * remove multicore option
 * fix usage of mongodb for replicasets
 * bump mongoose to 3.8.24
 * check if user found after decoding JWT token
 * fix typo in tag error handling function name

0.11.4 / 2015-03-08
===================

  * Add redirect to external signin and signup on backend
  * Fix calling next() no an error decoding jwt so it continues but without loading the user into the request

0.11.3 / 2015-03-07
===================

  * Remove 404 page to avoid problem on issue #690
  * Fix auth pages, saving a cookie supporting all subdomains if necessary (does not apply for localhost)

0.11.2 / 2015-03-07
===================

  * Fix signup and signin external urls

0.11.1 / 2015-03-06
===================

  * Send notification to notifier when a law is commented
  * Add notifier notification
  * Store jwt in cookies to work out between hub and DemocracyOS

0.11.0 / 2015-03-04
==================

 * Add hiding 'Read more' link text when topic has got only one paragraph contained in a single <div> element #438
 * Fix usage of mongodb connections to replica sets
 * Add checking for * CORS wildcard
 * Remove Dockerfile from .dockerignore
 * Update usage of mongodb by adding the db module
 * Add CORS support. CORS_DOMAINS env variables holds a whitelist of domains
 * Fix bad legacy text rendering #438
 * Hide clauses Add button for new laws and laws that have not clauses #675
 * Merge branch 'add/quilljs' into update/admin
 * Fix bad rendering on clauses with manually entered HTML #438
 * Fix responsive wrapping in clauses #438
 * Embed video responsively #438
 * Add video tooltip #438
 * Add Bullet button to toolbar #438
 * Fix side-commented empty lines #438
 * Add richtext editor for editing `law`s #438

0.10.14 / 2015-02-26
====================

  * Add missing translations Closes #671
  * Add instanceUrl and law.id to data sent to notifier #673
  * Add debugging configurations Closes #653
  * Add debug on Procfile and move running instructions to postinstall script on package.json file #465
  * Add unknown closing date translation Closes #655
  * Add missing keys Close #476
  * Add initial docker-related files
  * Add translation lib #643
  * Add in-app editing of side comments
  * Fix no comments msg when comment deleted Closes #662
  * Fix some portuguese translations
  * Fix combo filer visibility Closes #553
  * Fix build to process.exit(1) on error during build #465
  * Fix re-load of user when already logged Closes #652 #376
  * Fix bin file permissions #643
  * Fix error after login Closes #376
  * Fix login, use response data, dont fetch again user #376
  * Remove useless keys on en language #476
  * Remove unnecesary setting DEBUG on Procfile #465
  * Refactor citizen.optional middleware #376
  * Refactor db-api user public interface

0.10.13 / 2015-02-15
==================

 * Update all translations for full i18n support.

0.10.12 / 2015-02-15
==================

 * Update Dutch translation (thanks @Dandandan).

0.10.11 / 2015-02-14
==================

 * Add link to admin panel on dropdown. Closes #635
 * Minor tweaks for Ukrainian and Russian translations

0.10.10 / 2015-02-13
====================

  * Add translitarate when normalizing. Closes #642

0.10.9 / 2015-02-11
==================

 * Fix jump when scrolling headroom. Closes #637
 * Fix saving a `law` with no `tag` on it. Closes #624

0.10.8 / 2015-02-10
===================

  * Fix `timeago` interval to be 1s #631

0.10.7 / 2015-02-10
===================

  * Remove bus emitting events to call timeago.update(). Update timeago update interval #631
  * Bump DemocracyOS/side-comments version to 0.0.13 #631
  * Fix hour formatting in law admin. Closes #625
  * Fix duplicate entry in changelog

0.10.6 / 2015-02-07
==================

 * Fix error when clicking on show replies when not logged in. Fixes #632
 * Fix usage of COMMENTS_PER_PAGE in env.js so 0 is always default
 * Fixed paging limit in side-comments. Closes #623
 * Don't allow validated users to request resend validation email. Closes #604
 * Fixed separation between commenter and timestamp. Closes #620
 * When posting a new comment, timestamp shows immediately Closes #619
 * Remove setting timeago.interval since default is good enough (30 secs)
 * Add wrapper for multiple local-storage options. Closes #582
 * Make multiple CPU core usage optional via config. Closes #611

0.10.5 / 2015-02-05
==================

 * Update contributor acknowledgements
 * Bump version of DemocracyOS/side-comments. Fixes #615
 * Set timeago update interval to 30 secs (default) #615
 * Changed express.get by config to get token secret. Closes #613

0.10.4 / 2015-02-01
==================

 * Fix handling of errors on formview. Fixes #610
 * Make 'new-topic' notifications true by default

0.10.3 / 2015-01-31
==================

 * Fix Display side-comments button only on paragraph mouse-over for paragraphs with no comments. Closes #606
 * Fix tag icons go glitchy when tag names are shorter than 3 characters. Closes #607

0.10.2 / 2015-01-30
==================

 * Add swedish translation and credits
 * Changed 'forgot password' error description #602
 * Redirect to Resend validation token page if nonvalidated email is submitted. Closes #602.
 * Forgot password form xplanation now hides when form is submitted. Closes #594.
 * 'You must login' message placed over voting buttons. Closes #592.
 * Fixed signin after signup token validation. Closes #595.
 * Put 'signin required' message over argument on up/downvoting. Closes #593.
 * Fixed settings responsive styles. Closes #591
 * Move demo link above the image in README.md
 * Add Russian translation credits

0.10.1 / 2015-01-25
==================

 * Add Russian language

0.10.0 / 2015-01-25
==================

 * Update configuration defaults mechanism
 * Bump 'merge-util' server-side dep to version 0.3.1 and fix handling of config merge in env.js
 * Fix usage of config setting for external signin/signup URLs
 * Update CONTRIBUTORS.md
 * Bump 'merge-util' server-side dep to version 0.3.1 and fix handling of config merge in env.js
 * Fix usage of config setting for external signin/signup URLs
 * Support SSL via configuration. Closes #98 #587
 * Fixed race condition. Related to #98.
 * Add bin/dos-ssl script for self-signed SSL certificates #98.
 * Scroll and focus on textarea when clicking on New Argument button. Closes #555.
 * Added restrict middleware to update and delete operations #282 #580
 * Fixed misuse of dom.addClass method. Closes #580.
 * Rebase from development
 * Implemented JSON Web Tokens (JWT) authentication middleware #578
 * Added config parameter to disable signin/signup. Closes #573.
 * Add Galician translation
 * Add Ukrainian translation
 * Rename MongoDB collection citizens to users
 * Rename db-api/citizen.js to user.js
 * Use mongoUsersUrl or fallback to mongoUrl if the key doesn't exists in the config #559
 * Remove user-model module and export User model in lib/models #559
 * Update comments' and replies' author to get populated by the User model #559
 * Deprecated MONGO_HQ env var name in favor of MONGO_URL. Addendum to #525
 * Fix code to meet conventions
 * Fix read more participants. Closes #565
 * Add mongoUsersUrl to env config file #559
 * Add missing translations for #560 #478
 * Basic wrapper for notifier-client #560
 * Merge branch 'update/notifier-no-data-deps' into development
 * Update payload for 'law-published' notification. Closes #561
 * Added Gitter badge to README.md
 * Update error handling on response override to match refactored approach in FormView
 * Update re-send validation email view. Closes #478
 * Updates law filter model without fetch from server. Related to #460.
 * Changed the way voting badge is added to the sidebar. Closes #460.
 * CSS to Stylus where missing #215.
 * Replace vote up/down on comment card by comment-vote. Closes #471
 * Expose unvote calls  #471
 * Introduce comment vote view.  #471
 * Refactored several views to extend from View and FormView #282
 * Fixed onvote event binding. Closes #406.

0.9.0a / 2015-01-16
==================

 * Fix side-comments. Fixes #572

0.9.0 / 2015-01-06
==================

 * Fix faulty error handling in forgotpassword and signup with notifier. Closes #549
 * Remove unneeded entries from component.json
 * Fix autosubmit and FormView error handling
 * Made usage of notifier mandatory for mailing users.
 * Fix edit comment form buttons styles #529
 * Reply submit button not properly aligned #495
 * Remove mandrill and mailer dependencies
 * Refactor homepage to use a middelware instead of an if-check clause. Update dependencies #282
 * Switch local dep markdown to DemocracyOS/marked for #527
 * Update dom dependecy to avoid error of chained messages with .html() #282
 * Remove unused markdown local module. Closes #329
 * change local markdown dependecy by remote dependency #329
 * Bumped component-builder version to 1.2.0. Related to #475.
 * Fixed array length check throwing error with new version of dom. Related to #475.
 * Changed merge-util argument type on calling. Closes #475.
 * Remove deprecated comments-view component #282
 * Remove unused markdown local module. Closes #329
 * Improve styles and content for update browser page. Add links for donwload browsers. #168
 * Decreased separation between commenter's name and timestamp.
 * Hide header on scroll if app is rendered in mobile device. Closes #452.
 * Add middleware to handle unsupported browsers. Add module for unsupported browsers. #168
 * Fix #516: Upvote comment button underlines on hover
 * Fix #515: User name and timestamp overlap on replies
 * Add comment to current user's comments after successful submit #282
 * Improved pluralization. Related to #406.
 * Update participants counter and balloons after voting. Closes #406.
 * Update citizen model. Made reply notifications true by default
 * Voting made async and UI blocks when user clicks on voting buttons. Closes #394.
 * Add mail notifications when a law is published for users that are subscribed to it. Closes #473
 * Add setting for new-topic notification
 * Add delivering notifications to client
 * Add notifications attribute to citizen model
 * Add notifying when someone replies to an argument
 * Add notifier integration for forgot-password
 * Update sample config with notifier requirements
 * Add missing translations for settings in every language
 * Enable settings-notifications view #28
 * Add UI toggle component styled for DemocracyOS
 * Remove control logs. Actually closes #26
 * Make notifier usage dependent on configuration settings
 * Make signup email validations rely on notifier-client

0.8.26 / 2014-12-11
==================

 * Fix label logic for admin list law. Completes #504 and closes #472
 * User thumbnail is not aligned with user name. Closes #503
 * Remove jQuery scrolling to top after successful submit #458
 * On creating a law, routes to the page for the new law. Closes #421
 * Removed unique constraint for lawId. Closes #472.
 * Remove legacy unbinding code fixed updated by #501 for #497
 * Add restrict middleware to vote endpoint. Closes #490.
 * Update checking for switchOn and switchOff being typeof function #500
 * Author name supports apostrophes ('), hyphens (-) and dots (.). Closes #493.
 * Update view to support unbindAll when element is removed, detaching DOM events and Emitter event handlers. Closes #500
 * Update proposal-options to inherit from View #282
 * Update ProposalArticle to inherit from View #282
 * Fix reply submit button not properly aligned. Closes #495.
 * #484 Remove unnecesary colon and semicolon from .styl file
 * fix reply rendering after submittin. Closes #491
 * Separate participants-box into two separate components: one for holding the box and another one for each participant bubble #282
 * Remove unnecesary 'render' dependency
 * Remove unnecesary 'assert' library. Rename onremove method to _onremove to not collision with the FormView onremove method.
 * #484 Fix rule
 * #484 Fix h-scrolls on mobile settings. - migrate settings from css to stylus (related to  #215) - Fix media queryes.
 * #224 - Restrict first name length on user drop down text
 * Fixed mongoose sessions error. Closes #439.
 * Update CONTRIBUTING.md
 * New API method for getting the version info. Closes #444
 * Minor spelling corrections in English (procced --> proceed)
 * Fixed function declarations on Issue #430
 * Fix tag duplication on law creation. Closes #430.
 * Fixed weird behavior when deleting arguments as admin
 * Fix regex for URL validation. Closes #451

0.8.25 / 2014-11-07
==================

 * Add preventing disabled accounts to sign in

0.8.24 / 2014-10-22
==================

 * Fix dep ref back to upstream
 * Revert "Update ref to a breaking dep"
 * Revert "Update all dep refs from 'visionmedia' to 'tj' #456"

0.8.23 / 2014-10-21
==================

 * Update ref to a breaking dep

0.8.22 / 2014-10-21
==================
 * Update all dep refs from 'visionmedia' to 'tj' #456
 * Update dep for DemocracyOS/side-comments
 * Update refs for component/t
 * Pin deps for component/emitter

0.8.21 / 2014-10-21
==================

 * Fix fixtures use and add acknowledgements to README.md

0.8.20 / 2014-10-20
==================

 * Fix fetching own comments from mongodb

0.8.19 / 2014-10-15
==================

 * Fix layout and style of reply buttons. Closes #407

0.8.18 / 2014-10-09
==================

 * Fix comments not showing up on any law
 * Fix 'No citizen has argumented on this law yet' message

0.8.17 / 2014-10-08
==================

 * fix admin able to delete side-comments of all users. Closes #448
 * Fix avatar usage in side-comments. Closes #447

0.8.16 / 2014-10-08
==================

 * Fix summary html rendering
 * Complete catalan translation
 * Add side-comments for summary paragraphs. Closes #33
 * Fix sorting by 'Closing soon'. Close #442
 * removes spanish error message (changed to english) - PR #442
 * Update DemocracyOS/side-comments dep version. Close #436

0.8.15 / 2014-10-08
==================

 * Add deleting comments as a staff member

0.8.14 / 2014-10-07
==================

 * Bump sidebar-comments dep version to 0.0.9 and stylize them

0.8.13 / 2014-10-07
==================

 * Bump DemocracyOS/side-comments dep version

0.8.12 / 2014-10-07
==================

 * Fix side-comments avatar usage. Closes #447

0.8.11 / 2014-10-07
==================

 * Partially undo last fix

0.8.10 / 2014-10-07
==================

 * Fix filter box styles

0.8.9 / 2014-10-07
==================

 * [side-comments] - Fix side-comments dep

0.8.8 / 2014-10-06
==================

 * Pin mongoose version to 3.8.16

0.8.7 / 2014-10-06
==================

 * Bump component-resolver dep version

0.8.6 / 2014-10-02
==================

 * Update timeago dep

0.8.5 / 2014-09-30
==================

 * Fix rendering clauses when only 1 clause is present. Closes #440

0.8.4 / 2014-09-29
==================

 * Fix null citizen on lookup

0.8.3 / 2014-09-22
==================

 * Add author field to law #428
 * Add ToS and PP accept on signup #405
 * Remove 'Bill' prefix from title and remove required lawId #424
 * Fix refresh signin when there are no laws #434
 * Fix typo on 'Read more'

0.8.2 / 2014-09-19
==================

 * Add portuguese locale
 * Add missing key from `en.json`

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
 * Update headerBackgroundColor
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
