# Script para crear un usuario específico de base de datos para FarmaGest
# Debe ejecutarse como Administrador

Write-Host "=== Creacion de Usuario de Base de Datos FarmaGest ===" -ForegroundColor Cyan
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

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $version = $path -replace '.*PostgreSQL\\(\d+)\\bin', '$1'
        $postgresVersions += @{
            Path = $path
            Version = $version
        }
    }
}

if ($postgresVersions.Count -eq 0) {
    Write-Host "ERROR: No se encontraron instalaciones de PostgreSQL." -ForegroundColor Red
    pause
    exit 1
}

$postgresPath = $postgresVersions[0].Path
$psqlPath = "$postgresPath\psql.exe"

# Solicitar credenciales de PostgreSQL
Write-Host "=== Credenciales de PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

$dbUser = Read-Host "Usuario PostgreSQL (por defecto: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$securePassword = Read-Host "Contrasena de PostgreSQL" -AsSecureString
$dbPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

Write-Host ""
Write-Host "=== Crear Nuevo Usuario de Base de Datos ===" -ForegroundColor Cyan
Write-Host ""

$newDbUser = Read-Host "Nombre del nuevo usuario de base de datos (por defecto: farmagest_user)"
if ([string]::IsNullOrWhiteSpace($newDbUser)) {
    $newDbUser = "farmagest_user"
}

$secureNewPassword = Read-Host "Contrasena para el nuevo usuario" -AsSecureString
$newDbPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureNewPassword))

if ([string]::IsNullOrWhiteSpace($newDbPassword)) {
    Write-Host "ERROR: La contrasena no puede estar vacia" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Verificando conexion a PostgreSQL..." -ForegroundColor Yellow

$env:PGPASSWORD = $dbPassword
$testConnection = & $psqlPath -U $dbUser -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo conectar a PostgreSQL" -ForegroundColor Red
    $env:PGPASSWORD = ""
    pause
    exit 1
}

Write-Host "[OK] Conexion exitosa" -ForegroundColor Green
Write-Host ""

# Verificar si el usuario ya existe
Write-Host "Verificando si el usuario '$newDbUser' ya existe..." -ForegroundColor Yellow
$userExists = & $psqlPath -U $dbUser -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$newDbUser';" 2>&1

if ($userExists -match "1") {
    Write-Host ""
    Write-Host "[ADVERTENCIA] El usuario '$newDbUser' ya existe." -ForegroundColor Yellow
    $response = Read-Host "¿Deseas eliminarlo y recrearlo? (s/N)"
    
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host ""
        Write-Host "Eliminando usuario existente..." -ForegroundColor Yellow
        
        # Revocar privilegios y eliminar usuario
        & $psqlPath -U $dbUser -d postgres -c "REVOKE ALL PRIVILEGES ON DATABASE farmagest FROM $newDbUser;" 2>&1 | Out-Null
        & $psqlPath -U $dbUser -d postgres -c "DROP USER IF EXISTS $newDbUser;" 2>&1 | Out-Null
        
        Write-Host "[OK] Usuario eliminado" -ForegroundColor Green
    } else {
        Write-Host "Operacion cancelada." -ForegroundColor Yellow
        $env:PGPASSWORD = ""
        pause
        exit 0
    }
}

Write-Host ""
Write-Host "Creando usuario '$newDbUser'..." -ForegroundColor Yellow

# Crear usuario
$createUserSQL = "CREATE USER $newDbUser WITH PASSWORD '$newDbPassword';"
$result = & $psqlPath -U $dbUser -d postgres -c $createUserSQL 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Usuario creado exitosamente" -ForegroundColor Green
    
    # Verificar si la base de datos existe
    $dbExists = & $psqlPath -U $dbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='farmagest';" 2>&1
    
    if ($dbExists -match "1") {
        Write-Host ""
        Write-Host "Otorgando privilegios en la base de datos 'farmagest'..." -ForegroundColor Yellow
        
        # Otorgar privilegios en la base de datos
        & $psqlPath -U $dbUser -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE farmagest TO $newDbUser;" 2>&1 | Out-Null
        
        # Conectar a farmagest y otorgar privilegios en el esquema
        & $psqlPath -U $dbUser -d farmagest -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $newDbUser;" 2>&1 | Out-Null
        & $psqlPath -U $dbUser -d farmagest -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $newDbUser;" 2>&1 | Out-Null
        & $psqlPath -U $dbUser -d farmagest -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $newDbUser;" 2>&1 | Out-Null
        & $psqlPath -U $dbUser -d farmagest -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $newDbUser;" 2>&1 | Out-Null
        
        Write-Host "[OK] Privilegios otorgados" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "[ADVERTENCIA] La base de datos 'farmagest' no existe." -ForegroundColor Yellow
        Write-Host "Por favor, ejecuta primero el script 'crear-base-datos.ps1'" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "=== Usuario Creado Exitosamente ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usuario: $newDbUser" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para conectarte con este usuario:" -ForegroundColor Cyan
    Write-Host "  psql -U $newDbUser -d farmagest" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "[ERROR] No se pudo crear el usuario" -ForegroundColor Red
    Write-Host "Error: $result" -ForegroundColor Red
}

# Limpiar variable de entorno
$env:PGPASSWORD = ""

Write-Host ""
pause



