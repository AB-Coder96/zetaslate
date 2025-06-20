copy /Y "project-config.json" "frontend\src\project-config.json"
start cmd /k "cd frontend && npm run build"
pause

:: ── NEW: capture exact Python package versions
python -m pip freeze > "backend\requirements.txt"

git add .

:: commit message = <computer-name> + <this-bat-file-name> + “automatic”
set "COMMIT_MSG=%COMPUTERNAME% - %~nx0 automatic"
git commit -m "%COMMIT_MSG%"
git push
pause
