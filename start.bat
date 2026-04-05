@echo off
title MangaSet - Launcher
color 0A

echo ========================================
echo        MangaSet - Demarrage
echo ========================================
echo.

REM Verifier que le venv existe
if not exist "%~dp0venv\Scripts\activate.bat" (
    echo [ERREUR] Environnement virtuel introuvable.
    echo Creez-le avec: python -m venv venv
    pause
    exit /b 1
)

REM Verifier que node_modules existe
if not exist "%~dp0mangaset-frontend\node_modules" (
    echo [INFO] Installation des dependances npm...
    cd "%~dp0mangaset-frontend"
    npm install
    cd "%~dp0"
)

echo [1/2] Demarrage du Backend Django (port 8000)...
start "MangaSet Backend" cmd /k "cd /d %~dp0mangaset_backend && call %~dp0venv\Scripts\activate.bat && python manage.py runserver"

REM Petite pause pour laisser Django demarrer
timeout /t 3 /nobreak > nul

echo [2/2] Demarrage du Frontend Vite (port 5173)...
start "MangaSet Frontend" cmd /k "cd /d %~dp0mangaset-frontend && npm run dev"

echo.
echo ========================================
echo  Backend  : http://localhost:8000
echo  Frontend : http://localhost:5173
echo  Admin    : http://localhost:8000/admin
echo  API      : http://localhost:8000/api/v1
echo ========================================
echo.
echo Les deux serveurs sont lances dans des fenetres separees.
echo Fermez ces fenetres pour arreter les serveurs.
echo.
pause
