---
title: Permissions
position: 1
---

# Introduction

Generally, all forums are open for all registered users to participate. That means that any user can see the topics on any forum and comment or vote.

However, a forum owner could want to restrict the participation to a closed group or make the forum entirely private. All that cases are covered with DemocracyOS permission model. So, in DemocracyOS
- a forum can be *open for all*, where everyone can comment and vote;
- a forum can be *restricted*, where everyone can see the topics but some people can comment and vote;
- a forum can be *secret*, where nobody can see the topics or vote unless they are authorized by the owner or an admin.

We distinguish five roles on a forum:
- The *Owner* is unique, and cannot be changed. It's free to change everything regarding this forum.
- *Administrators* can give permissions to other users, edit forum settings, and manage the content (create and edit topics, etc).
- *Collaborators* can add, edit and delete topics on this forum.
- *Authors* can add topics but can't publish them, can only edit own not published topics.
- *Participants* can comment and vote this forum if it's Restricted or Private.
- *Moderator* can delete comments if allowed through config.

This article is intended to provide you, as a developer, guidelines to understand and extend the permissions approach.

# The model

This permission model is represented in the forum model, since we are only applying restrictions at a forum level. You'll find the following files next to the forum directory (`lib/models/forum/`):
- `index.js`: Both forum and permissions schemas, and its own specifics methods.
- `privileges.js`: Privileges are the calculated actions users can make, based on a User permissions and the forum's visibility.
- `roles.js`: List of roles allowed for forum permissions on each User.
- `visibilities.js`: List of allowed values for visibility key on forums.


# Middlewares

Some API operations are permission-aware, so when a user tries to perform any of it, the privileges should be checked. It is done by using Express middlewares that are implemented in `lib/middlewares/forum-middlewares/index.js`.
