# Script simple para crear la base de datos usando archivo .pgpass
# Si PostgreSQL pide contraseña, puedes crear un archivo .pgpass

Write-Host "=== Crear Base de Datos FarmaGest ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si PostgreSQL pide contraseña, hay varias opciones:" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPCION 1: Usar el script SQL directamente" -ForegroundColor Cyan
Write-Host "  psql -U postgres -f crear-todo-farmagest.sql" -ForegroundColor White
Write-Host "  (Cuando pida contraseña, presiona Enter o ingresa la contraseña)" -ForegroundColor Gray
Write-Host ""
Write-Host "OPCION 2: Configurar autenticacion sin contraseña" -ForegroundColor Cyan
Write-Host "  .\configurar-auth-postgres.ps1" -ForegroundColor White
Write-Host ""
Write-Host "OPCION 3: Establecer contraseña manualmente" -ForegroundColor Cyan
Write-Host "  1. Abre pgAdmin o psql" -ForegroundColor White
Write-Host "  2. Ejecuta: ALTER USER postgres WITH PASSWORD 'tu_contraseña';" -ForegroundColor White
Write-Host "  3. Luego ejecuta este script de nuevo" -ForegroundColor White
Write-Host ""

$postgresPath = "C:\Program Files\PostgreSQL\18\bin"
$psqlPath = "$postgresPath\psql.exe"

Write-Host "Intentando ejecutar el script SQL..." -ForegroundColor Yellow
Write-Host "Si pide contraseña, ingresa la contraseña que configuraste" -ForegroundColor Yellow
Write-Host "o presiona Enter si no tienes contraseña." -ForegroundColor Yellow
Write-Host ""

$scriptSQL = Join-Path $PSScriptRoot "crear-todo-farmagest.sql"

if (-not (Test-Path $scriptSQL)) {
    Write-Host "[ERROR] No se encontro crear-todo-farmagest.sql" -ForegroundColor Red
    exit 1
}

& $psqlPath -U postgres -f $scriptSQL

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Base de datos creada exitosamente!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[INFO] Si hubo error de autenticacion, usa una de las opciones arriba." -ForegroundColor Yellow
}

Write-Host ""
pause

