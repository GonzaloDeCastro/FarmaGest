# Script para crear la base de datos FarmaGest en PostgreSQL
# Debe ejecutarse como Administrador

Write-Host "=== Creacion de Base de Datos FarmaGest ===" -ForegroundColor Cyan
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
$psqlPath = "$postgresPath\psql.exe"

Write-Host ""
Write-Host "Usando PostgreSQL ${version}: $postgresPath" -ForegroundColor Cyan

# Verificar que psql existe
if (-not (Test-Path $psqlPath)) {
    Write-Host "ERROR: No se encontro psql.exe en: $psqlPath" -ForegroundColor Red
    pause
    exit 1
}

# Verificar que los scripts SQL existen
$scriptSoloDB = Join-Path $PSScriptRoot "crear-base-datos-solo.sql"
$scriptEsquema = Join-Path $PSScriptRoot "crear-esquema-farmagest.sql"

if (-not (Test-Path $scriptSoloDB)) {
    Write-Host "ERROR: No se encontro el script SQL: $scriptSoloDB" -ForegroundColor Red
    Write-Host "Por favor, asegurate de que el archivo crear-base-datos-solo.sql existe en el mismo directorio." -ForegroundColor Yellow
    pause
    exit 1
}

if (-not (Test-Path $scriptEsquema)) {
    Write-Host "ERROR: No se encontro el script SQL: $scriptEsquema" -ForegroundColor Red
    Write-Host "Por favor, asegurate de que el archivo crear-esquema-farmagest.sql existe en el mismo directorio." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "Scripts SQL encontrados:" -ForegroundColor Green
Write-Host "  - $scriptSoloDB" -ForegroundColor Gray
Write-Host "  - $scriptEsquema" -ForegroundColor Gray

# Solicitar credenciales de PostgreSQL
Write-Host ""
Write-Host "=== Credenciales de PostgreSQL ===" -ForegroundColor Cyan
Write-Host "Por favor, ingresa las credenciales para conectarte a PostgreSQL:" -ForegroundColor Yellow
Write-Host ""

$dbUser = Read-Host "Usuario (por defecto: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$securePassword = Read-Host "Contrasena" -AsSecureString
$dbPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

Write-Host ""
Write-Host "Verificando conexion a PostgreSQL..." -ForegroundColor Yellow

# Verificar conexión
$env:PGPASSWORD = $dbPassword
$testConnection = & $psqlPath -U $dbUser -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo conectar a PostgreSQL" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "  1. El servicio de PostgreSQL este corriendo" -ForegroundColor Yellow
    Write-Host "  2. Las credenciales sean correctas" -ForegroundColor Yellow
    Write-Host "  3. El puerto 5432 este disponible" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Error: $testConnection" -ForegroundColor Red
    $env:PGPASSWORD = ""
    pause
    exit 1
}

Write-Host "[OK] Conexion exitosa a PostgreSQL" -ForegroundColor Green
Write-Host ""

# Verificar si la base de datos ya existe
Write-Host "Verificando si la base de datos 'farmagest' ya existe..." -ForegroundColor Yellow
$dbExists = & $psqlPath -U $dbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='farmagest'" 2>&1

if ($dbExists -match "1") {
    Write-Host ""
    Write-Host "[ADVERTENCIA] La base de datos 'farmagest' ya existe." -ForegroundColor Yellow
    $response = Read-Host "¿Deseas eliminarla y recrearla? (s/N)"
    
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host ""
        Write-Host "Eliminando base de datos existente..." -ForegroundColor Yellow
        
        # Cerrar conexiones activas
        & $psqlPath -U $dbUser -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'farmagest' AND pid <> pg_backend_pid();" 2>&1 | Out-Null
        
        # Eliminar base de datos
        $dropResult = & $psqlPath -U $dbUser -d postgres -c "DROP DATABASE IF EXISTS farmagest;" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Base de datos eliminada" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] No se pudo eliminar la base de datos: $dropResult" -ForegroundColor Red
            $env:PGPASSWORD = ""
            pause
            exit 1
        }
    } else {
        Write-Host "Operacion cancelada." -ForegroundColor Yellow
        $env:PGPASSWORD = ""
        pause
        exit 0
    }
}

Write-Host ""
Write-Host "=== Creando Base de Datos ===" -ForegroundColor Cyan
Write-Host "Paso 1/2: Creando la base de datos..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar el script para crear solo la base de datos
$env:PGPASSWORD = $dbPassword
$result = & $psqlPath -U $dbUser -d postgres -f $scriptSoloDB 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Hubo un error al crear la base de datos" -ForegroundColor Red
    Write-Host "Error: $result" -ForegroundColor Red
    $env:PGPASSWORD = ""
    pause
    exit 1
}

Write-Host "[OK] Base de datos creada" -ForegroundColor Green
Write-Host ""
Write-Host "=== Creando Esquema y Tablas ===" -ForegroundColor Cyan
Write-Host "Paso 2/2: Creando tablas, índices y datos iniciales..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar el script para crear el esquema
$result = & $psqlPath -U $dbUser -d farmagest -f $scriptEsquema 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Base de datos creada exitosamente!" -ForegroundColor Green
    Write-Host ""
    
    # Verificar que las tablas se crearon
    Write-Host "Verificando tablas creadas..." -ForegroundColor Yellow
    $tableCount = & $psqlPath -U $dbUser -d farmagest -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>&1
    
    if ($tableCount -match "^\d+$") {
        Write-Host "[OK] Se crearon $tableCount tablas" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "=== Configuracion Completada ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "La base de datos 'farmagest' ha sido creada exitosamente." -ForegroundColor Green
    Write-Host ""
    Write-Host "Datos iniciales:" -ForegroundColor Cyan
    Write-Host "  - Roles: Administrador, Vendedor, Farmacéutico, Supervisor" -ForegroundColor White
    Write-Host "  - Categorías: Medicamentos, Higiene Personal, Suplementos, etc." -ForegroundColor White
    Write-Host "  - Ciudades: Buenos Aires, Córdoba, Rosario, etc." -ForegroundColor White
    Write-Host "  - Obras Sociales: OSDE, Swiss Medical, Medifé, etc." -ForegroundColor White
    Write-Host ""
    Write-Host "NOTA IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "  - El usuario administrador por defecto (admin@farmagest.com) necesita que se configure" -ForegroundColor Yellow
    Write-Host "    la contraseña hasheada desde el backend de la aplicación." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para conectarte a la base de datos:" -ForegroundColor Cyan
    Write-Host "  psql -U $dbUser -d farmagest" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "[ERROR] Hubo un error al crear la base de datos" -ForegroundColor Red
    Write-Host "Error: $result" -ForegroundColor Red
}

# Limpiar variable de entorno
$env:PGPASSWORD = ""

Write-Host ""
pause



