---
title: Install
position: 2
---

# Installation

This is a quick reference to get DemocracyOS up and running.

* [Requirements](#requirements)
  * [Notes](#notes)
* [Install](#install)
* [Running](#running)
  * [Running in a production environment](#running-in-production-environment)
  * [OS specifics](#os-specifics)
* [Loading sample data](#loading-sample-data)

## Requirements

To get started with DemocracyOS, you will need to have installed:

* [MongoDB](http://www.mongodb.org/downloads) open-source document database.
* [NodeJS & NPM](http://nodejs.org/) platform.
* [Git](http://git-scm.com/downloads) distributed version control system. If you're on github and don't have `git`, [you're doing it wrong](http://knowyourmeme.com/memes/youre-doing-it-wrong).
* [Make](http://www.gnu.org/software/make/) build automation utility.
* [OpenSSL](https://www.openssl.org/related/binaries.html) in case you want to generate SSL certificates.

### Notes

To run it on **Windows** you must use [Docker](https://www.docker.io/). In the [develop](http://docs.democracyos.org/develop/#docker-containers) section there's a tutorial on how to use it.

## Install

### Unix and OS/X with default settings

-  [git-clone](https://www.kernel.org/pub/software/scm/git/docs/git-clone.html) or download
[this repository](https://github.com/DemocracyOS/democracyos). The
recommended directory to host DemocracyOS on your system is ```/opt```.
- `cd` to the project's location
- Make sure MongoDB is running and reachable as configured in `config/defaults.json`.
- For the moment, keep the defaults settings. They work for a basic case. You will change
the [configuration file](http://docs.democracyos.org/configuration.html) content latter
accordingly your needs.
- DemocracyOS build requires **python2**. Check what python version your system is running with
this command: ```$ python -V```. If output indicates you are running python 3,
run: ```$ npm config set python python2.7```(change python version accordingly to your installed version).

Your ```.npmrc``` file have now this line: ```python=/usr/bin/python2.7```.
- Run `make`
- Boom! DemocracyOS should be running on ```http://localhost:3000```.

> Please refer to the [Configuration](configuration.md) section to customize settings


## Running

Once DemocracyOS components and dependencies are installed, you can start the application like this:

```bash
make run
```

Take a look at the [Makefile](https://github.com/DemocracyOS/app/blob/master/Makefile) for more information about the possible tasks you can run.

### Start/stop DemocracyOS service with systemd

 - Edit the following files:

```
/etc/systemd/system/democracyos.service
-------------------------------------
[Unit]
Description=democracyos Service
Wants=mongodb.service
After=mongodb.service

[Service]
User=democracyos
EnvironmentFile=/etc/democracyos.conf
ExecStart=/usr/bin/gulp --cwd /opt/democracyos

[Install]
WantedBy=default.target
```
_**NOTE**_:
In the Execstart line, change your democracy directory location accordingly
```
/etc/democracyos.conf
---------------------
GITHUB_USERNAME=<Your Github username>
GITHUB_PASSWORD=<Your github password>
NODE_PATH=.
STAFF='your email address'
```


- Create democracyos user

We want to create a system user without home directory and shell access.
```
useradd -r -s /usr/bin/nologin democracyos
```

- chown democracyos directory

We want to run democracyOS service as a simple user. To achieve this, democracyos user shall be able to read/write/execute the democracyOS directory.

```
# chown -R democracyos:wheel /opt/democracyos
```

- Start the service

Start democracyOS service with this command:

```
# systemctl start democracyos.service
```

- Verify the service is running

```
$ systemctl status democracyos.service
.....................................
● democracyos.service - democracyos Service
   Loaded: loaded (/etc/systemd/system/democracyos.service; disabled; vendor preset: disabled)
   Active: active (running) since Sun 2016-09-25 15:42:17 CEST; 16min ago
 Main PID: 8025 (gulp)
   CGroup: /system.slice/democracyos.service
           ├─8025 gulp                                                              
           └─8035 node index.js

Sep 25 15:43:09 hortensia gulp[8025]: Sun, 25 Sep 2016 13:43:09 GMT democracyos:notifier initializing agenda...
Sep 25 15:43:09 hortensia gulp[8025]: Sun, 25 Sep 2016 13:43:09 GMT democracyos:notifier agenda initialized.
Sep 25 15:43:09 hortensia gulp[8025]: Sun, 25 Sep 2016 13:43:09 GMT democracyos:server Embedded notifications service started
Sep 25 15:43:09 hortensia gulp[8025]: Sun, 25 Sep 2016 13:43:09 GMT democracyos:root DemocracyOS server running...
```

- Enable the service at boot

```
# systemctl enable democracyos
```


### Using SSL

In case you want to use SSL in your dev environment (it's disabled by default), you'll need to have proper certificate files.
We ship a script that generates the needed files. Just run the following command in the project root:

```bash
NODE_PATH=. node bin/dos-ssl
```

Then modify your configuration file by changing the `protocol` property to `https` and run it normally. Configuration options for SSL are listed [here](configuration.md#ssl).

### A note on using port 443

The default configuration file make the app listens to port 443 to handle SSL connections. In some OSs, a normal user cannot perform this operation, and you are likely to get this error:

```javascript
events.js:72
       throw er; // Unhandled 'error' event
             ^
Error: bind EACCES
   at errnoException (net.js:904:11)
   at net.js:1072:30
   at Object.37:1 (cluster.js:594:5)
[...]
```

To solve it without being root (that is always a bad idea), you can change the `ssl.port` value in your configuration file to another port, say `4443`.

### Running in production environment

1. Configure your [environment variables](https://github.com/DemocracyOS/app/wiki/Environment-variables) for production; specifically, set `NODE_ENV` to `production`
2. Set your `JWT_SECRET` environment variable to something random. e.g.: Any of [this](https://www.random.org/strings/?num=10&len=20&digits=on&upperalpha=on&loweralpha=on&unique=off&format=plain&rnd=new).
3. Set your MongoDB instance to run as a service.
4. Make sure to correctly configure the [Notifier](configuration.md#embebed-notifier-server) for production environments.
5. From the project's root path, you need to run `make` or:
  1. `npm install` to install node dependencies.
  2. `npm run build && npm run start` to build assets and run the app. _Don't run as `sudo`._

If something goes wrong you can always go back to a clean slate running `make clean`.

### OS specifics

* Check [this very detailed guide](https://github.com/okfn-brasil/democracyos/wiki/Install) if you're on Ubuntu 10 LTS.
* On Ubuntu 14/13/lower, install the package `node-legacy` for NodeJS.
* Check [this guide](https://github.com/DemocracyOS/app/wiki/Running-as-a-service) on how to run DemocracyOS as a service.

## Running unit tests

To run unit tests simply run
```
npm test
```

A running MongoDB instance is required to perform tests. By default, the `DemocracyOS-test` database is used and all its data is wiped on each run. If you want to override the database, just run the above command prefixing `MONGO_URL=<database uri>`. For example:

```
MONGO_URL=mongodb://localhost/other-db npm test
```

## Loading sample data

In order for you to see a fully working deployment, you *will* need some sample data. This can be achieved by either of these approaches:
* Manually [load sample fixtures](https://github.com/DemocracyOS/app/wiki/Load-fixtures) bundled with DemocracyOS.
* Setup and access the [administration module](https://github.com/DemocracyOS/app/wiki/Admin-module).
