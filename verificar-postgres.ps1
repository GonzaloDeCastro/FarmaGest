# Script de verificación rápida de PostgreSQL y preparación para FarmaGest
# No requiere ejecución como Administrador

Write-Host "=== Verificacion de PostgreSQL para FarmaGest ===" -ForegroundColor Cyan
Write-Host ""

# Verificar servicio
Write-Host "1. Verificando servicio de PostgreSQL..." -ForegroundColor Yellow
$service = Get-Service -Name "postgresql-x64-18" -ErrorAction SilentlyContinue
if ($service) {
    if ($service.Status -eq 'Running') {
        Write-Host "   [OK] Servicio corriendo" -ForegroundColor Green
    } else {
        Write-Host "   [ADVERTENCIA] Servicio no esta corriendo" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [ADVERTENCIA] No se encontro el servicio postgresql-x64-18" -ForegroundColor Yellow
    Write-Host "   Buscando otros servicios de PostgreSQL..." -ForegroundColor Gray
    Get-Service | Where-Object { $_.Name -like "*postgres*" } | Format-Table Name, Status -AutoSize
}

Write-Host ""

# Verificar instalación de PostgreSQL
Write-Host "2. Verificando instalacion de PostgreSQL..." -ForegroundColor Yellow
$postgresPath = "C:\Program Files\PostgreSQL\18\bin"
if (Test-Path $postgresPath) {
    Write-Host "   [OK] PostgreSQL 18 encontrado en: $postgresPath" -ForegroundColor Green
    if (Test-Path "$postgresPath\psql.exe") {
        $version = & "$postgresPath\psql.exe" --version 2>&1
        Write-Host "   $version" -ForegroundColor Gray
    }
} else {
    Write-Host "   [ADVERTENCIA] No se encontro PostgreSQL 18" -ForegroundColor Yellow
}

Write-Host ""

# Verificar PATH
Write-Host "3. Verificando PATH..." -ForegroundColor Yellow
if ($env:Path -like "*PostgreSQL*") {
    Write-Host "   [OK] PostgreSQL esta en el PATH" -ForegroundColor Green
} else {
    Write-Host "   [ADVERTENCIA] PostgreSQL no esta en el PATH" -ForegroundColor Yellow
    Write-Host "   Ejecuta: .\configurar-postgres.ps1 (como Administrador)" -ForegroundColor Gray
}

Write-Host ""

# Verificar scripts SQL
Write-Host "4. Verificando scripts SQL..." -ForegroundColor Yellow
$scripts = @(
    "crear-base-datos-solo.sql",
    "crear-esquema-farmagest.sql",
    "crear-base-datos.ps1",
    "crear-usuario-db.ps1"
)

$allOk = $true
foreach ($script in $scripts) {
    if (Test-Path $script) {
        Write-Host "   [OK] $script" -ForegroundColor Green
    } else {
        Write-Host "   [FALTA] $script" -ForegroundColor Red
        $allOk = $false
    }
}

Write-Host ""

# Verificar si la base de datos ya existe (requiere conexión)
Write-Host "5. Estado de la base de datos..." -ForegroundColor Yellow
Write-Host "   Para verificar si la base de datos 'farmagest' existe, ejecuta:" -ForegroundColor Gray
Write-Host "   psql -U postgres -lqt | Select-String farmagest" -ForegroundColor White

Write-Host ""
Write-Host "=== Resumen ===" -ForegroundColor Cyan
Write-Host ""

if ($service -and $service.Status -eq 'Running' -and (Test-Path $postgresPath) -and $allOk) {
    Write-Host "[OK] PostgreSQL esta listo para crear la base de datos!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Ejecuta como Administrador: .\crear-base-datos.ps1" -ForegroundColor White
    Write-Host "2. Ingresa las credenciales de PostgreSQL cuando se te solicite" -ForegroundColor White
    Write-Host "3. (Opcional) Ejecuta: .\crear-usuario-db.ps1 para crear un usuario especifico" -ForegroundColor White
} else {
    Write-Host "[ADVERTENCIA] Hay algunos problemas que resolver antes de continuar" -ForegroundColor Yellow
}

Write-Host ""
