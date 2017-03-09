---
title: Contributing
position: 4
---

# Contributing to DemocracyOS

If you have a question about DemocracyOS (not a bug report) please post it on [Gitter](https://gitter.im/DemocracyOS/app).


## Reporting bugs / Requesting features

For practical reasons we only accept issues that are bug reports or feature requests. Make sure to read the following guidelines before opening new issues.

### Avoid duplication

You'd help us out a lot by first checking if someone else has reported the same issue. Moreover, the issue may have already been resolved with a fix available.

### Help us to help you

Share as much information as possible. Include operating system and version, browser and version, version of DemocracyOS. Also include steps to reproduce the bug and any logs from browser and/or process whenever possible.

A good approach to a bug report is being very clear on how to reproduce it. Following this template might help (kudos to [@bastianhell](https://github.com/bastianhell)):

> 1. Run app with `make`
> 2. Navigate to `/route`
> 3. Click on `button` and see error in `console` output
>
> Results: What is the actual result that makes it a bug? (e.g: Misaligned text in header, see attached snapshot, etc.)
>
> Expected results: What should it look like? (e.g.: text in header should be aligned with dropdowns, etc.)


## Pull requests

To contribute code, start by forking our repo on github. You'll get something like this:

```
https://github.com/user/app
```

Then clone your fork:

```
git clone git@github.com:user/app && cd app/
```

Add the official repo as a remote, to track changes:

```
git remote add upstream git@github.com:DemocracyOS/app.git
```

Create a new branch for the changes you are going to contribute, with a relevant name. Some examples:

```
git checkout -b feature/some-new-stuff
git checkout -b fix/some-bug
git checkout -b remove/some-file
```

Hack your changes: (you don't need to actually run this)

```
vim somefile.txt
git add somefile.txt
git commit -a -m"adding somefile.txt"
```

Write your unit tests and check all tests pass by running `npm test`.

When you think your code is ready, prepare for pushing the code by first getting the changes from the main repo:

```
git pull --rebase upstream development
```
(You may need to solve any conflicts from the rebase at this point)

After that you can push the changes to your fork, by doing:

```
git push origin feature/some-new-stuff
git push origin fix/some-bug
```

Finally go to `https://github.com/DemocracyOS/app` in the browser and issue a new pull request. Github normally recognizes you have pending changes in a new branch and will suggest creating the pull request.

Main contributors will review your code and possibly ask for changes before your code is pulled in to the main repository. We appreciate your time and efforts!

### General guidelines

* We flag the issues to community participation as [help wanted](https://github.com/DemocracyOS/app/labels/help%20wanted), try to prioritize these.
* Do not make a pull request withouth having run the app on your own. This means, you have to at least [smoke test](http://en.wikipedia.org/wiki/Smoke_testing_(software))  what you did. If you can include some tests with your PR, the better.
* Try not to pollute your pull request with unintended changes. Keep them simple and small. Unrelated commits will prevent us from merging.
* Pull requests should always be against the `development` branch, never against `master`.
* All pull requests must comply with the project's [Coding Styles](coding-styles.md).
