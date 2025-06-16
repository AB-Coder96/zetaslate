@echo off
rem ── window 1: build, but /WAIT blocks until it exits
start "" /wait cmd /c "cd /d "%~dp0frontend" && npm run build"

rem ── window 2: commit & push after the build window closes
start "" cmd /k "git add . && git commit -m ^"build^" && git push"

pause
