@echo off
echo Удаление старых зависимостей...
rmdir /s /q node_modules 2>nul
rmdir /s /q .next 2>nul
del package-lock.json 2>nul

echo.
echo Установка новых зависимостей...
call npm install

echo.
echo Готово! Теперь запустите: npm run dev
pause

cd LeafSide.Frontend
Remove-Item -Recurse -Force node_modules, .next, package-lock.json -ErrorAction SilentlyContinue
npm install
npm run dev