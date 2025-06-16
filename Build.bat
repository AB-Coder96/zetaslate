copy /Y "backend\.env.prod" "backend\.env"
copy /Y "project-config.json" "frontend\src\project-config.json"
start cmd /k "cd frontend && npm run build"
pause
git add .
git commit -m "build"
git push
copy /Y "backend\.env.dev" "backend\.env"
pause
