---
title: Deploy
---

# Deploy Guides

### How to deploy to Heroku

1. First go to [Heroku](https://www.heroku.com) and create a new app (e.g.: **example-democracyos**) containing an instance of MongoLab.
2. Go to the app dashboard settings in https://dashboard.heroku.com/apps/example-democracyos/settings and copy the Git URL. In this case, it's git@heroku.com:example-democracyos.git
3. Add this as a remote in your app directory with the command `git remote add heroku git@heroku.com:example-democracyos.git`. You can name it whatever you want: `git remote add whatever git@heroku.com:example-democracyos.git`.
4. Add the [config variables needed for the app to work](https://github.com/DemocracyOS/app/wiki/Environment-variables) using `heroku config:set VAR_NAME=VALUE VAR_NAME2=VALUE2` etc.
5. Push the code with `git push heroku master`. Always push to the heroku's master branch for the changes to take effect.

The app should be running

**TL;DR (or I'll do it from the command line)**
```
➜  eg git:(master) heroku apps:create example-democracyos
➜  eg git:(master) heroku addons:add mongolab
➜  eg git:(master) heroku addons:add mandrill
➜  eg git:(master) heroku config:set NODE_ENV=production NODE_PATH=.
```

[IF version >= 0.7.6](https://github.com/DemocracyOS/app/wiki/Migrating-to--0.7.6)
```
➜  eg git:(master) heroku config:set GITHUB_USERNAME=your-github-username GITHUB_PASSWORD=your-github-api-token
```

***Note:*** ```heroku add ons:add mongolab``` sets environment variable ```MONGO_URI```, but ```MONGO_URL``` is required.

Run ```heroku config``` to see your ```MONGO_URI```, and then ```heroku config:set MONGO_URL=<what your MONGO_URI was>```
