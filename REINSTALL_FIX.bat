@echo off
echo ========================================
echo Исправление зависимостей Next.js
echo ========================================
echo.

echo [1/4] Остановка dev server...
echo Нажмите Ctrl+C в окне где запущен npm run dev
echo.
pause

echo [2/4] Удаление старых зависимостей...
rmdir /s /q node_modules 2>nul
rmdir /s /q .next 2>nul
del package-lock.json 2>nul
echo Готово!
echo.

echo [3/4] Установка новых зависимостей...
echo Это займет 1-2 минуты...
call npm install --legacy-peer-deps
echo.

echo [4/4] Проверка установки...
call npm list next react react-dom
echo.

echo ========================================
echo Готово! Запустите: npm run dev
echo ========================================
pause

