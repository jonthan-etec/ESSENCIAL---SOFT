@echo off
title Essencial Energia - Gestor de Carregamento (REV 001/2026)
chcp 65001 >nul
cls

echo ======================================================================
echo   ESSENCIAL ENERGIA - GESTOR DE ORDENS DE CARREGAMENTO
echo   MODO PORTATIL PARA PENDRIVE (PLUG ^& PLAY)
echo   Revisao: REV 001/2026 ^| Desenvolvido por Jonthan Oliveira
echo ======================================================================
echo.
echo   Iniciando o sistema localmente...
echo   Nenhum programa adicional (Node.js ou Python) e necessario!
echo   O navegador sera aberto automaticamente.
echo.
echo   Para encerrar o sistema, basta fechar esta janela.
echo ======================================================================
echo.

cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_pendrive.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Se o PowerShell estiver bloqueado, tentando abrir diretamente no navegador...
    start "" "%~dp0dist\index.html"
    pause
)
