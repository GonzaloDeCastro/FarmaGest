# Script para resetear la contraseña del usuario postgres
# Debe ejecutarse como Administrador

Write-Host "=== Reseteo de Contrasena de PostgreSQL ===" -ForegroundColor Cyan
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
$psqlPath = $postgresVersions[$selectedVersion].Path + "\psql.exe"
$serviceName = "postgresql-x64-$version"

$dataDir = $dataPath
$pgHbaFile = "$dataDir\pg_hba.conf"
$pgHbaBackup = "$dataDir\pg_hba.conf.backup"

Write-Host ""
Write-Host "Usando PostgreSQL ${version}" -ForegroundColor Cyan

# Verificar que el archivo existe
if (-not (Test-Path $pgHbaFile)) {
    Write-Host "ERROR: No se encontro el archivo: $pgHbaFile" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Archivo encontrado: $pgHbaFile" -ForegroundColor Green
Write-Host ""

# Hacer backup
Write-Host "Creando backup del archivo pg_hba.conf..." -ForegroundColor Yellow
try {
    Copy-Item -Path $pgHbaFile -Destination $pgHbaBackup -Force
    Write-Host "[OK] Backup creado" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo crear el backup: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Leyendo archivo pg_hba.conf..." -ForegroundColor Yellow

# Leer el archivo
$content = Get-Content -Path $pgHbaFile

# Buscar la linea de autenticacion para localhost y cambiarla a trust
$newContent = $content | ForEach-Object {
    if ($_ -match "^\s*host\s+all\s+all\s+127\.0\.0\.1/32\s+") {
        # Cambiar scram-sha-256 o md5 a trust temporalmente para localhost IPv4
        $_ -replace "(scram-sha-256|md5)", "trust"
    }
    elseif ($_ -match "^\s*host\s+all\s+all\s+::1/128\s+") {
        # Cambiar scram-sha-256 o md5 a trust temporalmente para localhost IPv6
        $_ -replace "(scram-sha-256|md5)", "trust"
    }
    elseif ($_ -match "^\s*local\s+all\s+all\s+") {
        # Cambiar scram-sha-256 o md5 a trust temporalmente para conexiones locales
        $_ -replace "(scram-sha-256|md5)", "trust"
    }
    else {
        $_
    }
}

# Guardar el archivo modificado
try {
    Set-Content -Path $pgHbaFile -Value $newContent
    Write-Host "[OK] Archivo pg_hba.conf modificado temporalmente" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo modificar el archivo: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Reiniciando servicio de PostgreSQL..." -ForegroundColor Yellow

# Reiniciar el servicio para aplicar cambios
try {
    Restart-Service -Name $serviceName -Force
    Write-Host "[OK] Servicio reiniciado" -ForegroundColor Green
    Start-Sleep -Seconds 3
} catch {
    Write-Host "[ERROR] No se pudo reiniciar el servicio: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "=== Configuracion Temporal Aplicada ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora puedes conectarte sin contrasena temporalmente." -ForegroundColor Yellow
Write-Host "Por favor, ingresa la nueva contrasena para el usuario postgres:" -ForegroundColor Cyan
Write-Host ""

# Pedir la nueva contraseña
$securePassword = Read-Host "Nueva contrasena para postgres" -AsSecureString
$passwordPlainText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

if ([string]::IsNullOrWhiteSpace($passwordPlainText)) {
    Write-Host "[ADVERTENCIA] No se ingreso ninguna contrasena. Usando contrasena por defecto: 'postgres'" -ForegroundColor Yellow
    $passwordPlainText = "postgres"
}

Write-Host ""
Write-Host "Cambiando la contrasena..." -ForegroundColor Yellow

# Intentar conectarse y cambiar la contraseña
$changePasswordQuery = "ALTER USER postgres WITH PASSWORD '$passwordPlainText';"

try {
    # Conectar sin contraseña (trust) y cambiar la contraseña
    $result = & $psqlPath -U postgres -d postgres -c $changePasswordQuery 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Contrasena cambiada correctamente" -ForegroundColor Green
    } else {
        Write-Host "[ADVERTENCIA] Error al cambiar la contrasena: $result" -ForegroundColor Yellow
        Write-Host "Intentando metodo alternativo..." -ForegroundColor Yellow
        
        # Método alternativo: usar variables de entorno
        $env:PGPASSWORD = ""
        $result2 = & $psqlPath -U postgres -d postgres -c $changePasswordQuery 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Contrasena cambiada correctamente (metodo alternativo)" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] No se pudo cambiar la contrasena: $result2" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "[ERROR] Error al ejecutar psql: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Restaurando archivo pg_hba.conf original..." -ForegroundColor Yellow

# Restaurar el archivo original
try {
    Copy-Item -Path $pgHbaBackup -Destination $pgHbaFile -Force
    Write-Host "[OK] Archivo restaurado" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo restaurar el archivo: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Por favor, restaura manualmente desde: $pgHbaBackup" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Reiniciando servicio de PostgreSQL nuevamente..." -ForegroundColor Yellow

# Reiniciar el servicio para aplicar la configuración original
try {
    Restart-Service -Name $serviceName -Force
    Write-Host "[OK] Servicio reiniciado" -ForegroundColor Green
    Start-Sleep -Seconds 3
} catch {
    Write-Host "[ERROR] No se pudo reiniciar el servicio: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Reseteo Completado ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora intenta conectarte con la nueva contrasena:" -ForegroundColor Green
Write-Host "  psql -U postgres" -ForegroundColor White
Write-Host ""
Write-Host "Si hay problemas, puedes restaurar el backup desde:" -ForegroundColor Yellow
Write-Host "  $pgHbaBackup" -ForegroundColor Gray
Write-Host ""

pause
