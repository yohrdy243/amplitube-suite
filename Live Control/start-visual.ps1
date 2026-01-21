# Live Control - Visual Startup Script
$Host.UI.RawUI.WindowTitle = "Live Control - AmpliTube"
$Host.UI.RawUI.BackgroundColor = "Black"
$Host.UI.RawUI.ForegroundColor = "Cyan"
Clear-Host

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LIVE CONTROL - AmpliTube" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Build client
Write-Host "[1/3] Compilando cliente..." -ForegroundColor Green
Set-Location client
npm run build | Out-Null
Set-Location ..
Write-Host "      ✓ Cliente compilado" -ForegroundColor Green
Write-Host ""

# Get IP address
Write-Host "[2/3] Obteniendo IP de red..." -ForegroundColor Green
$ipconfig = ipconfig | Select-String "IPv4" | Select-Object -First 1
$ip = $ipconfig -replace ".*: ", ""
$ip = $ip.Trim()
Write-Host "      ✓ IP detectada: $ip" -ForegroundColor Green
Write-Host ""

# Start server
Write-Host "[3/3] Iniciando servidor..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SERVIDOR CORRIENDO!" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Local:    " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Yellow
Write-Host "   Red:      " -NoNewline -ForegroundColor White
Write-Host "http://$($ip):3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "   CONECTA TU IPHONE A:" -ForegroundColor Magenta
Write-Host "   http://$($ip):3000" -ForegroundColor Yellow -BackgroundColor DarkMagenta
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Asegurate de que:" -ForegroundColor White
Write-Host " ✓ loopMIDI este ejecutandose" -ForegroundColor Gray
Write-Host " ✓ AmpliTube 5 MAX este abierto" -ForegroundColor Gray
Write-Host " ✓ Tu iPhone este en la misma red WiFi" -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Red
Write-Host ""

# Start server
node server/index.js

