# Script para cambiar el puerto de PostgreSQL al 5432
# Debe ejecutarse como Administrador

Write-Host "=== Cambiando Puerto de PostgreSQL ===" -ForegroundColor Cyan
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
        $dataPath = $path -replace '\\bin$', '\data'
        if (Test-Path $dataPath) {
            $postgresVersions += @{
                Path = $path
                Version = $version
                DataPath = $dataPath
            }
            Write-Host "  [OK] Encontrado PostgreSQL $version en: $path" -ForegroundColor Green
        }
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

$version = $postgresVersions[$selectedVersion].Version
$dataPath = $postgresVersions[$selectedVersion].DataPath
$serviceName = "postgresql-x64-$version"

$configFile = "$dataPath\postgresql.conf"
$backupFile = "$dataPath\postgresql.conf.backup"

Write-Host ""
Write-Host "Usando PostgreSQL ${version}" -ForegroundColor Cyan

# Verificar que el archivo existe
if (-not (Test-Path $configFile)) {
    Write-Host "ERROR: No se encontro el archivo de configuracion: $configFile" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Archivo de configuracion encontrado: $configFile" -ForegroundColor Green
Write-Host ""

# Hacer backup del archivo original
Write-Host "Creando backup del archivo de configuracion..." -ForegroundColor Yellow
try {
    Copy-Item -Path $configFile -Destination $backupFile -Force
    Write-Host "[OK] Backup creado: $backupFile" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo crear el backup: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Leyendo configuracion actual..." -ForegroundColor Yellow

# Leer el archivo
$content = Get-Content -Path $configFile -Raw

# Verificar el puerto actual
if ($content -match "port\s*=\s*(\d+)") {
    $currentPort = $matches[1]
    Write-Host "Puerto actual: $currentPort" -ForegroundColor Cyan
} else {
    Write-Host "[ADVERTENCIA] No se pudo determinar el puerto actual" -ForegroundColor Yellow
}

if ($currentPort -eq "5432") {
    Write-Host ""
    Write-Host "PostgreSQL ya esta configurado para usar el puerto 5432." -ForegroundColor Green
    Write-Host "No se requiere ningun cambio." -ForegroundColor Green
    pause
    exit 0
}

Write-Host ""
Write-Host "Cambiando puerto de $currentPort a 5432..." -ForegroundColor Yellow

# Reemplazar el puerto
$newContent = $content -replace "port\s*=\s*\d+", "port = 5432"

# Guardar el archivo
try {
    Set-Content -Path $configFile -Value $newContent -NoNewline
    Write-Host "[OK] Archivo de configuracion actualizado" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo actualizar el archivo: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Restaurando backup..." -ForegroundColor Yellow
    Copy-Item -Path $backupFile -Destination $configFile -Force
    pause
    exit 1
}

Write-Host ""
Write-Host "Reiniciando servicio de PostgreSQL..." -ForegroundColor Yellow

# Reiniciar el servicio
try {
    Restart-Service -Name $serviceName -Force
    Write-Host "[OK] Servicio reiniciado correctamente" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo reiniciar el servicio: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Por favor, reinicia el servicio manualmente desde servicios.msc" -ForegroundColor Yellow
    pause
    exit 1
}

# Esperar un poco para que el servicio inicie completamente
Start-Sleep -Seconds 3

# Verificar que el servicio esta corriendo
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
if ($service.Status -eq 'Running') {
    Write-Host "[OK] Servicio esta corriendo" -ForegroundColor Green
} else {
    Write-Host "[ADVERTENCIA] El servicio no esta corriendo. Por favor, verificalo manualmente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Verificando puerto..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

$portCheck = netstat -ano | findstr ":5432" | findstr "LISTENING"
if ($portCheck) {
    Write-Host "[OK] PostgreSQL esta escuchando en el puerto 5432" -ForegroundColor Green
} else {
    Write-Host "[ADVERTENCIA] No se detecto el puerto 5432 en LISTENING" -ForegroundColor Yellow
    Write-Host "Espera unos segundos y verifica manualmente con: netstat -ano | findstr :5432" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Cambio completado ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora puedes conectarte a PostgreSQL sin especificar el puerto:" -ForegroundColor Green
Write-Host "  psql -U postgres" -ForegroundColor White
Write-Host ""
Write-Host "Si hay problemas, puedes restaurar el backup desde:" -ForegroundColor Yellow
Write-Host "  $backupFile" -ForegroundColor Gray
Write-Host ""

pause

