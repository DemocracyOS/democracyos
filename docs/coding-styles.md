---
title: Coding Styles
position: 5
---

# Coding Styles

## GIT conventions

In general terms, we agree with almost everything said in this [blog post about GIT conventions](https://medium.com/code-adventures/a940ee20862d) and so should you. We only add/differ the following:

Commits should try to be as simple (atomic) as possible, but not simpler. Meaning you should always be able to revert specific `fix`es, `edit`s, `update`s, `add`s, and `remove`s with `git revert`

## Javascript

* Two spaces for indentation, never tabs.
* `var` everything, never comma first.
* Single quotes only, never double quotes (opposite to HTML/Jade).
* Avoid trailing whitespace. Blank lines should not have any space.
* Inline documentation for new methods, class members, etc.
* One space between conditionals/functions, and their parenthesis and curly braces
  * `if (..) {`
  * `for (..) {`
  * `while (..) {`
  * `function (err) {`
* Use [Yoda conditions](https://en.wikipedia.org/wiki/Yoda_conditions), always `'string' === typeof el` instead of `typeof el === 'string'`.

## Stylesheets

* See [.stylintrc](/.stylintrc) file. More info: https://rosspatton.github.io/stylint/
* For module specific styles, comply with `#unique-template-top-node-selector .my-generic-css-update { ... }`
* `.classes` and `#ids` should only be used to reference from `CSS` files. If you want to use some element from `JS` use `data-*` to always be sure where the element is referenced from.
* For multiple, comma-separated selectors, place each selector on its own line.
* Attribute selectors, like `input[type="text"]` should always wrap the attribute's value in double quotes, for consistency and safety (see this [blog post on unquoted attribute values](http://mathiasbynens.be/notes/unquoted-attribute-values) that can lead to XSS attacks).

## HTML/Jade

* Two spaces for indentation, never tabs.
* Double quotes only, never single quotes.
* Avoid trailing whitespace. Blank lines should not have any space.
* Use CDNs and HTTPS for third-party JS when possible. We don't use protocol-relative URLs in this case because they break when viewing the page locally via `file://.

## Local Modules

* Each Module should be placed in it's containing folder on `/lib`, as [NodeJS Starter](https://github.com/rickyrauch/nodejs-starter). _(e.g. `/lib/sidebar`, `/lib/models`)_
* Entry points:
  + **Server side JS:** `index.js`. _(e.g. `/lib/db-api/index.js`)_
  + **Client side JS:** `${module-name}.js`. _(e.g. `/lib/sidebar/sidebar.js`)_
  + **Client side CSS:** `styles.styl`. _(e.g. `/lib/sidebar/styles.styl`)_
  + Main `HTML` template file is `template.jade`. _(e.g. `/lib/sidebar/template.jade`)_
