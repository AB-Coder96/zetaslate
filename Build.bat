start cmd /k "cd frontend_2 && npm run build"
pause
robocopy "frontend_2\dist" "docs" /MIR
git add .
:: commit message = <computer-name> + <this-bat-file-name> + “automatic”
set "COMMIT_MSG=%COMPUTERNAME% - %~nx0 automatic"
git commit -m "%COMMIT_MSG%"
git push
pause
