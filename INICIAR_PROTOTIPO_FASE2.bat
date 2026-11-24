@echo off
title Sistema Gestion Auditorios - Capstone Duoc UC - Fase 2
color 0b
echo ===============================================================================
echo   SISTEMA AUTONOMO DE GESTION OPERATIVA DE AUDITORIOS - DUOC UC
echo   Fase 2: Prototipo Funcional Operativo (Meta Evaluacion: 7.0)
echo   Super Administrador: benjamin54144752123@gmail.com
echo ===============================================================================
echo.
echo [1/3] Verificando entorno y dependencias...
cd /d "c:\Users\MAANDO\Desktop\PROYECTO DE TITULO\objetos proyecto de titulo"

echo [2/3] Abriendo navegador predeterminado en http://localhost:3000 ...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo [3/3] Iniciando servidor Next.js 15 en modo produccion/desarrollo...
echo.
echo Presiona Ctrl + C para detener el servidor cuando finalice la demostracion.
echo.
npm run dev
pause
