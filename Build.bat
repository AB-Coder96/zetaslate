copy /Y "project-config.json" "frontend\src\project-config.json"
start cmd /k "cd frontend && npm run build"
pause
call "%~dp0venv\Scripts\activate.bat"
:: ── NEW: capture exact Python package versions
python -m pip freeze > "backend\requirements.txt"
robocopy "frontend\dist" "docs" /MIR
git add .

:: commit message = <computer-name> + <this-bat-file-name> + “automatic”
set "COMMIT_MSG=%COMPUTERNAME% - %~nx0 automatic"
git commit -m "%COMMIT_MSG%"
git push
pause
