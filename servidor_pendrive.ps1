# ====================================================================
# ESSENCIAL ENERGIA - SERVIDOR PORTATIL PARA PENDRIVE (WINDOWS)
# Revisao: REV 001/2026 | Desenvolvido por Jonthan Oliveira
# Nao requer instalacao de Node.js, Python ou qualquer outro software!
# ====================================================================

param(
    [int]$PortaInicial = 3000,
    [switch]$ModoApp = $false
)

$Host.UI.RawUI.WindowTitle = "Essencial Energia - Gestor de Carregamento (REV 001/2026)"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$distDir = Join-Path $scriptDir "dist"
$dataFile = Join-Path $scriptDir "dados_pendrive.json"

if (-not (Test-Path $distDir)) {
    Write-Host ""
    Write-Host " [ERRO] A pasta 'dist' nao foi encontrada!" -ForegroundColor Red
    Write-Host " Verifique se voce copiou todos os arquivos para o pendrive." -ForegroundColor Yellow
    Write-Host ""
    Read-Host " Pressione Enter para fechar..."
    exit 1
}

# Tenta encontrar porta livre a partir de 3000
$porta = $PortaInicial
$listener = $null
$tentativas = 0

while ($tentativas -lt 20) {
    try {
        $testListener = New-Object System.Net.HttpListener
        $prefixo = "http://localhost:$porta/"
        $testListener.Prefixes.Add($prefixo)
        $testListener.Start()
        $listener = $testListener
        break
    } catch {
        $porta++
        $tentativas++
    }
}

if ($null -eq $listener -or -not $listener.IsListening) {
    Write-Host " [ERRO] Nao foi possivel iniciar na porta $PortaInicial ate $porta." -ForegroundColor Red
    Read-Host " Pressione Enter para fechar..."
    exit 1
}

Write-Host "======================================================================" -ForegroundColor DarkCyan
Write-Host "  ESSENCIAL ENERGIA - GESTOR DE ORDENS DE CARREGAMENTO" -ForegroundColor Yellow
Write-Host "  MODO PORTATIL PARA PENDRIVE - PLUG & PLAY EM QUALQUER COMPUTADOR" -ForegroundColor White
Write-Host "  Revisao: REV 001/2026 | Desenvolvido por Jonthan Oliveira" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor DarkCyan
Write-Host ""
Write-Host " [OK] Servidor local ativo em: http://localhost:$porta" -ForegroundColor Cyan
Write-Host " [OK] Banco de dados portatil: dados_pendrive.json" -ForegroundColor Green
Write-Host " [OK] Zero instalacao necessaria (roda 100% nativo no Windows)" -ForegroundColor Gray
Write-Host ""
Write-Host " Para encerrar o sistema a qualquer momento, basta fechar esta janela." -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor DarkCyan
Write-Host ""

# Localiza Microsoft Edge para Modo Aplicativo Desktop do Windows
$edgePaths = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:LocalAppData}\Microsoft\Edge\Application\msedge.exe"
)

$edgeExe = $null
foreach ($p in $edgePaths) {
    if (Test-Path $p) {
        $edgeExe = $p
        break
    }
}

$urlApp = "http://localhost:$porta"

# Abrir aplicacao
if ($ModoApp -and $edgeExe) {
    Start-Process $edgeExe -ArgumentList "--app=$urlApp", "--window-size=1366,820", "--window-position=50,50"
} elseif ($edgeExe) {
    Start-Process $edgeExe -ArgumentList "--app=$urlApp"
} else {
    Start-Process $urlApp
}

# Tabela de Tipos MIME
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".webmanifest" = "application/manifest+json; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
}

# Loop de atendimento de requisicoes
try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $res.Headers.Add("Access-Control-Allow-Origin", "*")
        $res.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $res.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        if ($req.HttpMethod -eq "OPTIONS") {
            $res.StatusCode = 200
            $res.Close()
            continue
        }

        $caminhoUrl = $req.Url.LocalPath

        # API de Sincronizacao de Dados do Pendrive
        if ($caminhoUrl -eq "/api/pendrive-data") {
            if ($req.HttpMethod -eq "GET") {
                if (Test-Path $dataFile) {
                    $jsonTxt = [System.IO.File]::ReadAllText($dataFile, [System.Text.Encoding]::UTF8)
                } else {
                    $jsonTxt = '{"ordens":[],"catalogo":[],"versao":"REV 001/2026","desenvolvedor":"Jonthan Oliveira"}'
                }
                $bytesJson = [System.Text.Encoding]::UTF8.GetBytes($jsonTxt)
                $res.ContentType = "application/json; charset=utf-8"
                $res.ContentLength64 = $bytesJson.Length
                $res.OutputStream.Write($bytesJson, 0, $bytesJson.Length)
                $res.Close()
                continue
            }
            elseif ($req.HttpMethod -eq "POST") {
                $leitor = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
                $corpo = $leitor.ReadToEnd()
                [System.IO.File]::WriteAllText($dataFile, $corpo, [System.Text.Encoding]::UTF8)
                
                $ack = '{"success":true,"mensagem":"Dados sincronizados com o pendrive com sucesso!"}'
                $bytesAck = [System.Text.Encoding]::UTF8.GetBytes($ack)
                $res.ContentType = "application/json; charset=utf-8"
                $res.ContentLength64 = $bytesAck.Length
                $res.OutputStream.Write($bytesAck, 0, $bytesAck.Length)
                $res.Close()
                continue
            }
        }

        # Arquivos Estaticos da Pasta dist
        $subCaminho = $caminhoUrl.TrimStart('/')
        if ([string]::IsNullOrEmpty($subCaminho) -or $subCaminho -eq "/") {
            $subCaminho = "index.html"
        }

        $caminhoArquivo = Join-Path $distDir $subCaminho

        # Roteamento SPA
        if (-not (Test-Path $caminhoArquivo) -or (Get-Item $caminhoArquivo).PSIsContainer) {
            $caminhoArquivo = Join-Path $distDir "index.html"
        }

        if (Test-Path $caminhoArquivo) {
            $ext = [System.IO.Path]::GetExtension($caminhoArquivo).ToLower()
            $tipoMime = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $tipoMime = $mimeTypes[$ext]
            }
            $res.ContentType = $tipoMime
            $bytesArquivo = [System.IO.File]::ReadAllBytes($caminhoArquivo)
            $res.ContentLength64 = $bytesArquivo.Length
            $res.OutputStream.Write($bytesArquivo, 0, $bytesArquivo.Length)
        } else {
            $res.StatusCode = 404
        }
        $res.Close()
    }
} finally {
    if ($null -ne $listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
