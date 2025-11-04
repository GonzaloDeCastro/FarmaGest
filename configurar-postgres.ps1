# Script para configurar PostgreSQL en el PATH de Windows
# Debe ejecutarse como Administrador

Write-Host "=== Configurador de PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si se esta ejecutando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: Este script debe ejecutarse como Administrador" -ForegroundColor Red
    Write-Host "Por favor, haz click derecho en PowerShell y selecciona 'Ejecutar como administrador'" -ForegroundColor Yellow
    pause
    exit 1
}

# Buscar instalaciones de PostgreSQL
$postgresVersions = @()
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\18\bin",
    "C:\Program Files\PostgreSQL\17\bin",
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\Program Files\PostgreSQL\15\bin",
    "C:\Program Files\PostgreSQL\14\bin",
    "C:\Program Files\PostgreSQL\13\bin",
    "C:\Program Files\PostgreSQL\12\bin"
)

Write-Host "Buscando instalaciones de PostgreSQL..." -ForegroundColor Yellow

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $version = $path -replace '.*PostgreSQL\\(\d+)\\bin', '$1'
        $postgresVersions += @{
            Path = $path
            Version = $version
        }
        Write-Host "  [OK] Encontrado PostgreSQL $version en: $path" -ForegroundColor Green
    }
}

if ($postgresVersions.Count -eq 0) {
    Write-Host ""
    Write-Host "No se encontraron instalaciones de PostgreSQL." -ForegroundColor Red
    Write-Host "Por favor, instala PostgreSQL primero desde: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "Instalaciones encontradas:" -ForegroundColor Cyan
for ($i = 0; $i -lt $postgresVersions.Count; $i++) {
    Write-Host "  [$($i + 1)] PostgreSQL $($postgresVersions[$i].Version)"
}

# Si hay multiples versiones, preguntar cual usar
$selectedVersion = 0
if ($postgresVersions.Count -gt 1) {
    Write-Host ""
    $selection = Read-Host "Selecciona la version que deseas usar (1-$($postgresVersions.Count))"
    $selectedVersion = [int]$selection - 1
    
    if ($selectedVersion -lt 0 -or $selectedVersion -ge $postgresVersions.Count) {
        Write-Host "Seleccion invalida. Usando la version mas reciente." -ForegroundColor Yellow
        $selectedVersion = 0
    }
}

$postgresPath = $postgresVersions[$selectedVersion].Path
$version = $postgresVersions[$selectedVersion].Version

Write-Host ""
Write-Host "Usando PostgreSQL ${version}: $postgresPath" -ForegroundColor Cyan

# Obtener el PATH actual del sistema
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

# Verificar si ya esta en el PATH
if ($currentPath -like "*$postgresPath*") {
    Write-Host ""
    Write-Host "PostgreSQL $version ya esta en el PATH del sistema." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Agregando PostgreSQL $version al PATH del sistema..." -ForegroundColor Yellow
    
    # Agregar al PATH
    $newPath = "$currentPath;$postgresPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    
    Write-Host "[OK] PostgreSQL agregado al PATH correctamente" -ForegroundColor Green
    
    # Actualizar el PATH de la sesion actual tambien
    $env:Path += ";$postgresPath"
}

# Verificar la instalacion
Write-Host ""
Write-Host "Verificando instalacion..." -ForegroundColor Yellow

try {
    $psqlVersionOutput = & "$postgresPath\psql.exe" --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] psql funciona correctamente" -ForegroundColor Green
        Write-Host "  $psqlVersionOutput" -ForegroundColor Gray
    } else {
        Write-Host "[ADVERTENCIA] psql encontrado pero hubo un error al verificar" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ADVERTENCIA] No se pudo verificar psql: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Verificar el servicio
Write-Host ""
Write-Host "Verificando servicio de PostgreSQL..." -ForegroundColor Yellow

$serviceName = "postgresql-x64-$version"
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq 'Running') {
        Write-Host "[OK] El servicio de PostgreSQL esta corriendo" -ForegroundColor Green
    } else {
        Write-Host "[ADVERTENCIA] El servicio de PostgreSQL no esta corriendo" -ForegroundColor Yellow
        Write-Host "  Intentando iniciar el servicio..." -ForegroundColor Yellow
        try {
            Start-Service -Name $serviceName
            Write-Host "[OK] Servicio iniciado correctamente" -ForegroundColor Green
        } catch {
            Write-Host "[ERROR] No se pudo iniciar el servicio: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "[ADVERTENCIA] No se encontro el servicio '$serviceName'" -ForegroundColor Yellow
    Write-Host "  Esto puede ser normal si el servicio tiene otro nombre" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Configuracion completada ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Debes cerrar y volver a abrir PowerShell/Terminal" -ForegroundColor Yellow
Write-Host "para que los cambios en el PATH surtan efecto." -ForegroundColor Yellow
Write-Host ""
Write-Host "Luego puedes verificar con:" -ForegroundColor Cyan
Write-Host "  psql --version" -ForegroundColor White
Write-Host "  psql -U postgres" -ForegroundColor White
Write-Host ""

pause
