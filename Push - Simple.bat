setlocal enabledelayedexpansion
for /f "tokens=*" %%a in ('hostname') do set "computer_name=%%a"
git submodule foreach 'git stash'
Git add .
Git commit -m "simple push updates (!computer_name!)"
Git push
endlocal
pause