copy /Y "project-config.json" "frontend\src\project-config.json"
start cmd /k "cd %cd% && npm run build"
git add .
git commit -m"build"
git push
pause