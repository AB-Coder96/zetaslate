:: ── NEW: capture exact Python package versions
python -m pip freeze > "backend\requirements.txt"
git add .
set "COMMIT_MSG=%COMPUTERNAME% - %~nx0 automatic"
git commit -m "%COMMIT_MSG%"
git push
pause
