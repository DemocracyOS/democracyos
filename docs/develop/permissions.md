---
title: Permissions
position: 1
---

# Introduction

Generally, all forums are open for all registered users to participate. That means that any user can see the topics on any forum and comment or vote.

However, a forum owner could want to restrict the participation to a closed group or make the forum entirely private. All that cases are covered with DemocracyOS permission model. So, in DemocracyOS
- a forum can be *entirely open*, where everyone can comment and vote;
- a forum can be *partially open*, where everyone can see the topics but some people can comment and vote;
- a forum can be private, where nobody can see the topics or vote unless they are authorized by the owner or an admin.

We distinguish three roles on a forum:
- The *owner* is the user who created the forum. He has administrator privileges and also can add more administrators and collaborators.
- A forum *administrator* can add more collaborators and can participate, even if the forum is private.
- A forum *collaborator* can participate, even if the forum is private.

This article is intended to provide you, as a developer, guidelines to understand and extend the permissions approach.

# The model

This permission model is represented in the forum model, since we are only applying restrictions at a forum level. You'll see this two properties in the Forum schema (`lib/models/forum.js`):
- `private`
- `permissions`

The first one is just a `Boolean` property that indicates if the forum is private or not.

The second one holds other two properties: `admins` and `collaborators`, both `Array`s of `User` model. Those arrays holds the users that belongs to each role.

For each forum, permission granting and revoking is handled by the API endpoints, as a unique entry point. Also, additional business logic is handled in the DB API layer (`/lib/db-api/forum.js`).

# API endpoints

The `forum` API endpoint set has three methods that handles per-forum permission operations. In `lib/forum-api/index.js` you'll find:
- `GET /api/forum/:id/permissions`: Delivers a list of roles the users that belongs to each role.
- `POST /api/forum/:id/permission`: Adds a new role-user pair to the `permissions` property of the forum. In the payload, it expects a JSON object with two properties:
	- `user`: the affected user's ID
	- `role`: the role name (`'admin'` or `'collaborator'`)
- `DELETE /api/forum/:id/permission`: Deletes a role-user pais from the `permissions` property for the forum. In the payload it expects a JSON object with a `user` and a `role` as explained above.

# Hooks

Some API operations are permission-aware, so when a user tries to perform any of it, the permissions should be checked. It is done by using Express middlewares that are implemented in `lib/forum-middlewares/index.js` and `lib/forum-api/index.js`.

# How to extend permission model

There are two ways to extend the permission model: by adding more roles to the forum permission model and by adding more roles to other entity (i.e., topics).

The first way is the easiest, because you only have to add more properties to the `permissions` object in the `Forum` schema.
The second way replicates the `permissions` property to other entities, leading to an non-centralized permission handling. This pattern is not easily scalable and should be avoided in a more complex permission schema.

The way of checking permissions should be done at a API level and using middlewares, in order to encourage code reusing.
