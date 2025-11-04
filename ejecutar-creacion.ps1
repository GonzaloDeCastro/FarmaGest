# Script simplificado para crear la base de datos FarmaGest
# Este script ejecuta los comandos SQL directamente

Write-Host "=== Creacion de Base de Datos FarmaGest ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script ejecutara los comandos SQL para crear la base de datos." -ForegroundColor Yellow
Write-Host "Si PostgreSQL pide contraseña, simplemente presiona Enter (Enter vacio)" -ForegroundColor Yellow
Write-Host ""

$postgresPath = "C:\Program Files\PostgreSQL\18\bin"
$psqlPath = "$postgresPath\psql.exe"

# Verificar si psql existe
if (-not (Test-Path $psqlPath)) {
    Write-Host "ERROR: No se encontro psql.exe" -ForegroundColor Red
    exit 1
}

Write-Host "Ejecutando script SQL completo..." -ForegroundColor Green
Write-Host ""

# Ejecutar el script SQL completo
$scriptSQL = Join-Path $PSScriptRoot "crear-todo-farmagest.sql"

if (-not (Test-Path $scriptSQL)) {
    Write-Host "ERROR: No se encontro el archivo crear-todo-farmagest.sql" -ForegroundColor Red
    exit 1
}

# Ejecutar el script
& $psqlPath -U postgres -f $scriptSQL

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== BASE DE DATOS CREADA EXITOSAMENTE ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "La base de datos 'farmagest' ha sido creada con todas sus tablas." -ForegroundColor Green
    Write-Host ""
    Write-Host "Para conectarte:" -ForegroundColor Cyan
    Write-Host "  psql -U postgres -d farmagest" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Puede haber habido un error. Verifica los mensajes arriba." -ForegroundColor Yellow
    Write-Host "Si la base de datos ya existe, esto es normal." -ForegroundColor Yellow
}

Write-Host ""
pause

