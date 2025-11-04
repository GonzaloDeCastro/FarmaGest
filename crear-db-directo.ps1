# Script para crear la base de datos FarmaGest sin requerir contraseña
# Si PostgreSQL pide contraseña, simplemente presiona Enter

Write-Host "=== Creacion de Base de Datos FarmaGest ===" -ForegroundColor Cyan
Write-Host ""

$postgresPath = "C:\Program Files\PostgreSQL\18\bin"
$psqlPath = "$postgresPath\psql.exe"

Write-Host "Creando base de datos..." -ForegroundColor Yellow

# Crear la base de datos directamente
$createDB = @"
CREATE DATABASE farmagest
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
"@

$createDB | & $psqlPath -U postgres -d postgres 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Base de datos creada" -ForegroundColor Green
} else {
    Write-Host "[INFO] La base de datos puede que ya exista, continuando..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Creando esquema y tablas..." -ForegroundColor Yellow

# Ejecutar el script del esquema
$scriptEsquema = Join-Path $PSScriptRoot "crear-esquema-farmagest.sql"
& $psqlPath -U postgres -d farmagest -f $scriptEsquema 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Base de datos creada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para conectarte: psql -U postgres -d farmagest" -ForegroundColor Cyan
} else {
    Write-Host "[ERROR] Hubo un problema al crear el esquema" -ForegroundColor Red
}

Write-Host ""
pause

