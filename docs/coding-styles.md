---
title: Coding Styles
position: 5
---

# Coding Styles

## GIT conventions

In general terms, we agree with almost everything said in this [blog post about GIT conventions](https://medium.com/code-adventures/a940ee20862d) and so should you. We only add/differ the following:

Commits should try to be as simple (atomic) as possible, but not simpler. Meaning you should always be able to revert specific `fix`es, `edit`s, `update`s, `add`s, and `remove`s with `git revert`

## Javascript

We use [eslint](http://eslint.org/) to check our code for the coding styles specified in the `.eslintrc` file in the root of the app, you can configure your text editor to give you hints when you don't follow the styles.

## Stylesheets

* See [.stylintrc](/.stylintrc) file. More info: https://rosspatton.github.io/stylint1-0/
* For module specific styles, comply with `#unique-template-top-node-selector .my-generic-css-update { ... }`
* `.classes` and `#ids` should only be used to reference from `CSS` files. If you want to use some element from `JS` use `data-*` to always be sure where the element is referenced from.
* For multiple, comma-separated selectors, place each selector on its own line.
* Attribute selectors, like `input[type="text"]` should always wrap the attribute's value in double quotes, for consistency and safety (see this [blog post on unquoted attribute values](http://mathiasbynens.be/notes/unquoted-attribute-values) that can lead to XSS attacks).
