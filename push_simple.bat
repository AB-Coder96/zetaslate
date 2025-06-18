:: ── NEW: capture exact Python package versions
python -m pip freeze > "backend\requirements.txt"
git add .
git commit -m"parent automatic"
git push
pause