@echo off
title Essencial Energia - Aplicativo Windows (REV 001/2026)
chcp 65001 >nul
cls

echo ======================================================================
echo   ESSENCIAL ENERGIA - APLICATIVO WINDOWS PORTATIL (PENDRIVE)
echo   Modo Aplicativo Dedicado de Janela Unica
echo   Revisao: REV 001/2026 ^| Desenvolvido por Jonthan Oliveira
echo ======================================================================
echo.
echo   Abrindo o sistema em modo aplicativo de desktop...
echo   Para encerrar, basta fechar esta janela ou a janela do aplicativo.
echo.

cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_pendrive.ps1" -ModoApp
