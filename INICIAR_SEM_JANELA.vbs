' ====================================================================
' ESSENCIAL ENERGIA - INICIALIZADOR SILENCIOSO (SEM JANELA PRETA)
' Revisao: REV 001/2026 | Desenvolvido por Jonthan Oliveira
' ====================================================================

Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
ScriptDir = FSO.GetParentFolderName(WScript.ScriptFullName)

CmdLine = "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ScriptDir & "\servidor_pendrive.ps1"""
WshShell.Run CmdLine, 0, False
Set WshShell = Nothing
