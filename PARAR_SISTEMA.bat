@echo off
title Encerrar Essencial Energia
chcp 65001 >nul
cls

echo ======================================================================
echo   ESSENCIAL ENERGIA - ENCERRAR APLICATIVO
echo ======================================================================
echo.
echo   Finalizando instâncias locais do servidor...

powershell -Command "Get-Process -Name powershell -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*servidor_pendrive.ps1*' } | Stop-Process -Force"

echo.
echo   [OK] Sistema encerrado com sucesso.
echo.
pause
