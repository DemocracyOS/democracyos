---
title: Notifications
position: 2
---

# Introduction
The Notifications module aims to register all the application events a user might be interested. At a database level, those events are stored in the `notifications` collection. On the frontend, they are displayed in the `/notifications` page, accessible through the bell icon near the user badge.

Until now, we are registering three kind of events:
- When a user replies to somebody else's comment
- When a user upvotes somebody else's comment
- When a user downvotes somebody else's comment

# The model
In `lib/models/notification.js` is declared the `NotificationSchema` that defines the `Notification` Mongoose model. It has the following properties:
- `user`: `ObjectId` that refers to the `User` whose notification is targeted. In the case of a reply, its the user who wrote the replied comment.
- `type`: `enum` that represents what kind of notification is.
- `comment`: `ObjectId` that points to a `Comment`.
- `relatedUser`: `ObjectId` that refers to the `User` that triggered the notification. In the case of a reply, its the replier.
- `topic`: `ObjectId` that refers to a related `Topic`.

There is a virtual method, `url`, that returns the URL of the target object (in this case, the topic that holds the replied/upvoted/downvoted comment).

# API endpoints

Notifications are created and pushed to the database via an internal API. They cannot be created through the public API, but they can be queried.
The public API is located in `lib/notification-api/index.js` and has only one endpoint: `GET /api/notification/all`, that delivers all the notifications for the logged in user (the app forbids to retrieve notifications of other user).

# Pushing a new notification

Internally, the notifications are pushed to the `notifications` collection through the `lib/notifications/index.js` module, by calling the `send` function. That function overrides the `NotifierClient#send()` function, that internally calls two asynchronous functions: one pushes the notification document and the other one calls `notifier` to send a notification e-mail.

# Notification page

The notifications page is accessible by browsing to `/notifications` or clicking in the bell icon next to the user badge. The page lifecycle is handled in the `lib/notifications-page` module.

# What about `notifier`?

The notifications module does not replace the `notifier` module. They work together and its responsibilities are different: `notifications` responsibility is to push a notification document into the `notifications` collection on the database. `notifier`'s responsibility is to send an e-mail using the configured transport.

# Roadmap

We are heading to change `notifier` behavior by making it poll the `notification` collection in order to find unread notifications and build and send a digest e-mail notifying all together the pending events of a user.

Also, we are continuously improving the `notifications` module to make it more usable.
