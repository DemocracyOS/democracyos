
2.9.2 / 2017-08-29
==================

  * execute captcha on submit
  * update analytics
  * dont migrate results on closed topics
  * fix registry empty body response

2.9.1 / 2017-08-28
==================

  * fix res.json in client
  * add optional recaptcha
  * add blacklist migration
  * add blacklist emails
  * add recaptcha on user registration
  * update topic.voted
  * update topic publish api to v2
  * decouple votes from topic schema
  * Fix express deprecated warning
  * Add new operator for ObjectId
  * fix lint no-undef
  * fix most of lint errors
  * use mongoose objectId
  * simplify engines semver

2.9.0 / 2017-08-17
==================

  * expose forum.extra & update pollOptions validation
  * add empty options poll validation
  * jade map es5 fix
  * results init to db-api & fixes
  * update topic action migration
  * add topic action migration
  * fix topic actions
  * fix voting front components
  * update topic get api
  * refactor voting creation

2.8.5 / 2017-07-27
==================

  * Update democracyos-notifier to 2.1.2
  * Fix error logging on startup

2.8.0 / 2017-07-10
==================

  * Add slack errors
  * update notifier to 2.1.0
  * Add new-comment notification

2.7.3 / 2017-07-09
==================

  * Update notifier to 2.0.3

2.7.1 / 2017-07-09
==================

  * Update notifier to 2.0.2

2.6.2 / 2017-07-03
==================

  * Fix timeago component
  * Fix TopicConnector

2.6.1 / 2017-07-03
==================

  * Fix reset password
  * Add ignore docker-compose override
  * Set docker mongo version & add dev debug config
  * Fix forum store import
  * Update topic tags autocomplete select

2.6.0 / 2017-06-09
==================

  * Fix mongoIdString comparison
  * Add tags fuzzy search autocomplete
  * Fix arrow function messing up virtuals scope on Topic Model
  * Update topic support icon
  * Add topic tag navigation

2.5.2 / 2017-06-02
==================

  * Update democracyos-notifier to 1.5.0
  * Remove topic-voted job calls
  * Remove unused rssEnabled and commentsPerPage configs
  * Remove feedsLimit from docs
  * Fix topic closed flag

2.5.1 / 2017-05-25
==================

  * Update democracy-notifier to 1.4.0

2.5.0 / 2017-05-25
==================

  * Fix error when DemocracyOS is not initialized
  * Add ONBUILD commands for /ext on Docker image
  * Fix logout on settings and admin
  * Fix links text on topic form
  * Fix topic closingAt admin form
  * Add description fields on Topic form
  * Remove flaticons
  * Add /notifications route to urlBuilder
  * Add /settings routes to urlBuilder
  * Add Topic.participantsCount to DB #1417
  * Add Topic Support Action
  * Add Topic Preview on admin
  * Add Collaborative Forum

2.4.0 / 2017-05-04
==================

  * fix admin whitelists view export #1394
  * Fix package.json & .snyk to reduce vulnerabilities #1390
  * Update polls styles and UI #1408
  * Update topic api find and findAll endpoints to api-v2
  * Add custom attributes for Topics #1406

2.3.2 / 2017-04-26
==================

  * Fix radix-trie dep

2.3.1 / 2017-04-26
==================

  * Fix empty tag value
  * Fix visibility wildcard for admin Close #1392
  * Fix visibility middleware on /api
  * Remove legacy comments api and db-api

2.3.0 / 2017-04-26
==================

  * Add Tags on Topics #1396
  * Fix coverUrl svg error on topic edit
  * Update es translations for privileges
  * Fix homeLink on header
  * Fix facebook-card share
  * Fix card cover url
  * Add react header everywhere

2.2.3 / 2017-04-21
==================

  * Update notifier to 1.3.1

2.2.2 / 2017-04-07
==================

  * Update password digest algorithm from sha1 to sha256
  * Update Passport.js to 0.3.2

2.2.1 / 2017-04-05
==================

  * Fix Topic.participants population

2.2.0 / 2017-04-05
==================

  * Add Forum search for multiForum #1386

2.1.1 / 2017-04-05
==================

  * Fix topic update with polls
  * Fix poll ownVote rendering
  * Remove topicStore restriction to vote and poll on unlaoded items
  * Update react routes definition without JSX

2.1.0 / 2017-04-03
==================

  * Add Polls as an alternative to voting #1382
  * Add Topic PUT and POST on APIv2
  * Fix cmd+click on user badge items
  * Fix unknown closing date message
  * Fix moment config on admin and settings

2.0.4 / 2017-03-27
==================

  * Fix js build when minifying

2.0.3 / 2017-03-27
==================

  * Fix tag form #1381
  * Fix admin link on firefox

2.0.2 / 2017-03-24
==================

  * Fix empty value on topic.action.method

2.0.1 / 2017-03-23
==================

  * Fix migrate-mongoose on production

2.0.0 / 2017-03-23
==================

  * Update ALL dependencies
  * Add node and npm version checker on startup
  * Add DB migrations
  * Add Api v2 and progressively deprecate /lib/api
  * Add React + React Router on /lib/site ✨
  * Add Topic privileges by user
  * Update Comments forms UI
  * Add multi-auth (FB + Email)
  * Add user-badge editable by Staff members
  * Add Bootstrap v4 #1268
  * Add /ext folder functionality

1.6.0 / 2017-03-23
==================

  * Add snyk.io service
  * Clarify installation steps order
  * Update Express to v4
  * Update Dockerfile location to root folder

1.5.2 / 2016-10-24
==================

  * Fix democracyos-notifier crash updating it to 1.1.2

1.5.1 / 2016-10-19
==================

  * Update democracyos-notifier version

1.5.0 / 2016-10-18
==================

  * Add config.notifications.nodemailer config option
  * Update democracyos-notifier version
  * Update version of democracyos-config
  * Add availableLocales on embedded notifier config

1.4.5 / 2016-09-29
==================

  * Fix export on validate
  * Update jwtSecret clarification for production on docs

1.4.4 / 2016-09-21
==================

  * Add a random jwtSecret when not configured
  * Sanitize HTML from comments #1304

1.4.3 / 2016-09-20
==================

  * Fix header user badge not showing

1.4.2 / 2016-09-19
==================

  * Add insecure warning message to pages, Thanks @dkaoster! #1285

1.4.1 / 2016-09-14
==================

  * Fix Italian translations, thanks to @GillesChamp #1289
  * Fix build command - validate default export was duplicated

1.4.0 / 2016-08-05
==================

  * Add Let's Ecnrypt tool for free certificates generation #1278
  * Remove jQuery from site and settings modules :D

1.3.0 / 2016-08-01
==================

  * Add multiple bundles for different sections #1264
  * Reorganize all the folders in submodules

1.2.0 / 2016-06-22
==================

  * Add Docker for development #1078
  * Add per-forum permission model #1169

1.1.5 / 2016-05-18
==================

  * Fix forum delete modal#1210
  * Fixed polish translations
  * fix social links #1199
  * Fix facebook authentication #1204

1.1.4 / 2016-04-13
==================

  * Update mLab MongoDB Env var (#1203)
  * Update README.md (#1201)

1.1.3 / 2016-03-30
==================

  * Don't show Forums settings when the app is on singleForum mode #1198

1.1.2 / 2016-03-28
==================

  * Fix dependecy azer/strip with striptags #1197
  * Add IMPLEMENTATIONS.md file #1191

1.1.1 / 2016-03-02
==================

  * Update notifier version
  * Update README.md

1.1.0 / 2016-02-03
==================

  * Fix topic-publish notification
  * Fix fixtures #1178
  * Add circumflex accents for user names #1184
  * Fix scrollbar overlaps the header
  * Add in-app notifications page #1126

1.0.6 / 2015-12-04
==================

  * Fix reply edit form #1161
  * Fixed a few Romanian words
  * Update Dockerfile

1.0.5 / 2015-11-30
==================

  * Specify all css dependencies on package.json #1133

1.0.4 / 2015-11-26
==================

  * Fix build error #1153
  * Fix signin redirect #1139
  * Update Galician translations #1151 (@dalareo)

1.0.3 / 2015-11-18
==================

  * Fix word breaking on comment-boxes #1144

1.0.2 / 2015-11-18
==================

  * Add Romanian language #1134 Thanks @alexproca!
  * Remove unsued local libs #1130
  * Add Node.js 4.0 requirement #1114
  * Add and enforce new Styleguide #1127
  * Remove Google+ share button
  * Fix notification parameters overwriting #1122

1.0.1 / 2015-10-30
==================

  * Add new config variables for sending emails. Close #1106
  * Add not marking as empty a clause with img elements Closes #1098
  * Add user.optional middleware on /signup and /signin. Close #1107
  * Add sublime files to .gitignore
  * Update democracyos-notifier to ~0.0.14
  * Update .gitignore
  * Remove lib/tags/tags.js
  * Remove notificiation on topic-commented, closes #1080
  * Fix error on remove date
  * Fix #1066, clear closign add closes datepicker
  * Fix cache cleaning of Store.findAll

1.0.0 / 2015-10-23
==================

  * [forum] - Fix showing create new topic on own forum #1091
  * add settings/forums link on user-badge
  * clear topicStore before loading forum homepage
  * remove unused variables
  * remove unused variables
  * preload forum homepage before rendering
  * fix forums/new form styles
  * fix newsfeed margin
  * [translations:es] - Add missing translations for forum form
  * Merge pull request #1094 from DemocracyOS/fix-forums-list-update
  * Merge pull request #1092 from DemocracyOS/fix-forum-admin-link
  * fix forums list reloading Closes #1090
  * Merge pull request #1093 from DemocracyOS/fix/forum-api
  * [forum-api] - Fix finding forums by ids and names
  * fix styles
  * add cover image on forums homepage
  * add cover when user is not logged in
  * add create button when all forums where deleted Closes #1089
  * fix create a forum button on settings/forum
  * add forums/admin link on settings/forums
  * Merge pull request #1086 from DemocracyOS/add/new-homepage
  * [homepage] - Add -createdAt sorting and title in Spanish
  * add forums/admin link on settings/forums
  * Fix deleting a forum and validating summary < 300 characters
  * add this.switchOn and this.switchOff on base view
  * Merge pull request #1085 from DemocracyOS/fix/uncapitalize-urls
  * add homepage title
  * fix homepage pagination button
  * add pagination of forums on homepage
  * [routing] - Add 301 redirect to lowercased version of that URL if uppercase characters are present. Close #1084
  * fix forum admin
  * [docs] - Revert deploy docs
  * [docs] - Add deploy docs
  * sort translation files
  * add pagination on forum-api
  * fix js styles
  * always populate owner when fetching forum
  * fix forum config bar responsiveness
  * add styleings to forum lists on homepage
  * use view/mixins on newsfeed
  * fix selectors
  * normalize forum-card name
  * [homepage] - New basic homepage listing forums #1079
  * [docs] - Fix markdown bug
  * Add development guide
  * [feed] - Remove all Feed references #1079
  * Fixed admin link. Closes #1075
  * Release 0.19.3
  * allow to access /forgot when visibility=hidden
  * Fixed Deploy to Heroku button link. Closes #1062
  * Update Deploy to Heroku link
  * Update README.md to include Deploy to Heroku button
  * Release 0.19.2
  * Release 0.19.1
  * [whitelist] - Update max whitelists shown per page (5000)
  * Rebase
  * Merge pull request #684 from solde9/fix/smooth-scrolling
  * Rearranged CodeClimate badge
  * Added codeclimate badge
  * Merge pull request #1007 from DemocracyOS/add/show-email-config
  * dont allow to show emails on public instances
  * Merge pull request #1009 from DemocracyOS/fix/facebook-login
  * [facebook-strategy] Added profileFields key to Passport's Facebook strategy constructor, as seen in https://github.com/jaredhanson/passport-facebook/issues/129#issuecomment-124039674. Fixes empty email issue on login.
  * [comments] - Smooth scroll: Wrap common functionality #659
  * show a message to the user on facebook login error Closes #1001
  * [comments] - Modify smooth scroll #659
  * add publicEmails config
  * dont allow to register fb users without email Closes #1001
  * [comments] - add textarea.focus() #659
  * [comments-edit] - Add smooth-scrolling #659
  * [comments-replies] - scroll only if element is outside the viewport #684
  * [comments-view] - scroll only if element is outside the viewport #684
  * [is-in-viewport] - Add isElementInViewport function #684
  * [comments-replies] - Add smooth-scrolling while opening the form #659
  * [comments-view] - Add smooth-scrolling while opening the form #659
  * Merge pull request #1000 from jacobmiller/patch-1
  * rm vot-it
  * Merge pull request #972 from galiumodorat/feature/Polish-translation
  * added Polish translation
  * Release 0.19.0
  * Add greek translation credit
  * add greek laguage name
  * add greek translations
  * add test option
  * add test option
  * fix dos-translate async processing
  * fix dos-translate directory pointing
  * fix dos-translate library
  * Release 0.18.0
  * Merge pull request #962 from fabriciodisalvo/patch-1
  * Added missing line for 'Chinese (Trad)' language
  * Added missing line for 'Chinese (Trad)' language
  * Update en.json
  * Update supported.js
  * Update zh_TW.json
  * Create zh_TW.json
  * add gitter link on CONTRIBUTING
  * Update license year
  * bump notifier-client dep version
  * Merge pull request #942 from fonorobert/update/accented-chars-in-names
  * add new accented chars to regex, closes #941
  * rename config.showResults to config.alwaysShowTopicResults
  * add local config reference to component.json
  * remove console.log statement
  * Release 0.17.6
  * update notifier-client to 0.3.0
  * fix wait for laws.loaded before rendering homepage
  * Fix homepage first law shown
  * Merge pull request #938 from DemocracyOS/fix-law-show
  * law page depend on laws bus, not on sidebar Closes #898
  * remove duplicated config key
  * Merge pull request #931 from DemocracyOS/fix-mobile-menu-icon
  * use headerFontColor on mobile menu icon Closes #930
  * add showResults config key and check it in proposal-options, closes #926
  * fix t() invoke on proposal-options.js
  * add .eslintrc file
  * Merge pull request #924 from a0viedo/patch-2
  * Merge pull request #925 from a0viedo/patch-3
  * added license in package.json
  * using relative links in readme
  * Release 0.17.5
  * Fix async of logout Closes #921
  * fix user token loading
  * Merge pull request #920 from DemocracyOS/fix-forgot-route
  * fix user verification
  * allow public access to /forgot routes Closes #919
  * Add email normalization Closes #689
  * Revert "added japanese"
  * removed console print statements
  * removed extra line added
  * changed tabs to spaces
  * Add error handler for incorrect current password
  * fixed bug where JSON.parse was being called on non-JSON data
  * undid data additions
  * added japanese

0.19.3 / 2015-09-28
===================

  * Allow access to /forgot when config.visibility is 'hidden'
  * Include Deploy to Heroku button on README.md

0.19.2 / 2015-09-14
===================

  * Add showing a message to the user on facebook login error Closes #1001
  * Add codeclimate badge
  * Add profileFields key to Passport's Facebook strategy constructor, as seen in https://github.com/jaredhanson/passport-facebook/issues/129#issuecomment-124039674. Fixes empty email issue on login.
  * Add publicEmails config
  * Add not allowing to register fb users without email Closes #1001
  * Add textarea.focus() on comments #659
  * Add scroll only if element is outside the viewport in comment replies #684
  * Add isElementInViewport function #684
  * Add not allowing to show emails on public instances
  * Added Polish translation
  * Update CodeClimate badge
  * Update smooth scroll #659
  * Remove vot-it reference

0.19.1 / 2015-09-14
===================

  * Update max whitelists shown per page (5000)

0.19.0 / 2015-07-06
==================

 * Add Greek translation
 * Add Chinese (traditional) translation credit

0.18.0 / 2015-07-02
==================

 * add support for Chinese (Traditional) language
 * add gitter link on CONTRIBUTING.md
 * add new accented chars to regex, closes #941
 * add config setting to always show voting results. Closes #926

0.17.6 / 2015-06-16
===================

  * Update notifier-client version to 0.3.0
  * Fix homepage first law shown #898
  * Use config.headerFontColor on mobile menu icon #930
  * Add license in package.json
  * Use relative links in readme

0.17.5 / 2015-06-12
===================

  * Fix UI refresh on logout #921
  * Fix forgot password when VISIBILITY is 'hidden' #920
  * Add email normalization #689
  * Add ALLOW_EMAIL_ALIASES configuration #689
  * Add error handler for incorrect current password #714

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
 * Merge pull request #488 from DemocracyOS/revert-487-394-votes-count
 * Remove unnecesary 'assert' library. Rename onremove method to _onremove to not collision with the FormView onremove method.
 * #484 Fix rule
 * #484 Fix h-scrolls on mobile settings. - migrate settings from css to stylus (related to  #215) - Fix media queryes.
 * #224 - Restrict first name length on user drop down text
 * Fixed mongoose sessions error. Closes #439.
 * Update CONTRIBUTING.md
 * New API method for getting the version info. Closes #444
 * Merge pull request #455 from bigokro/fix/proceed-in-english
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
