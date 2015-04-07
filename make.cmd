@echo off

rem
rem DemocracyOS Makefile
rem

if DEBUG == "" set DEBUG=democracyos*

if NODE_ENV == "" set NODE_ENV="development"

if not "%1" == "run" goto packages
echo "Starting application..."
set NODE_PATH=.
set DEBUG=%DEBUG%
node index.js
goto end

:packages
if not "%1" == "packages" goto clean
echo "Installing dependencies..."
@npm install
echo "Installed !"
goto end

:clean
if not "%1" == "clean" goto help
echo "Removing dependencies, components and built assets."
rd /S/Q node_modules
rd /S/Q components
rd /S/Q public
echo Done
goto end

:help

echo make command
@echo
echo run
echo packages
echo clean

:end
