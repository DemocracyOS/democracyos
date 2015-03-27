#! /bin/sh
# Requires being authenticated on a deis controller
# It affects *all* apps in a controller, including the ones that are soft-deleted.

for appname in `deis apps`; do
  if [ $appname != "===" ] && [ $appname != "Apps" ] 
  then
    deis config:list -a $appname
    deis config:set -a $appname HUB_URL=https://hub.democracyos.com
    deis config:unset -a $appname EXTERNAL_SETTINGS_URL
    deis config:unset -a $appname EXTERNAL_SIGNIN_URL
    deis config:unset -a $appname EXTERNAL_SIGNUP_URL
  fi
done