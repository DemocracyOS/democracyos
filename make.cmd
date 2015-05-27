@echo off

rem
rem DemocracyOS Makefile emulation for Windows
rem

if DEBUG == "" set DEBUG=democracyos:*

if NODE_ENV == "" set NODE_ENV="development"

if not "%1" == "run" goto packages
if exist INSTALLED goto run

echo Installing dependencies...
call npm install
echo INSTALLED >INSTALLED
echo.
if errorlevel 0 echo Installed !
echo.
:run
echo Starting application...
set NODE_PATH=.
set DEBUG=%DEBUG%
call node index.js
goto end

:packages
if not "%1" == "packages" goto clean
echo Installing dependencies...
call npm install
echo INSTALLED >INSTALLED
echo.
if errorlevel 0 echo Installed !
echo.
goto end

:clean
if not "%1" == "clean" goto help
echo Removing dependencies, components and built assets.
rd /S/Q node_modules
rd /S/Q components
rd /S/Q public
del INSTALLED
echo Done !
goto end

:help

echo.
echo make [command]
echo.
echo     packages
echo     run
echo     clean
echo.

:end
