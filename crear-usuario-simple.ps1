# Script para crear un usuario específico de base de datos para FarmaGest
Write-Host "=== Creacion de Usuario de Base de Datos FarmaGest ===" -ForegroundColor Cyan
Write-Host ""

$postgresPath = "C:\Program Files\PostgreSQL\18\bin"
$psqlPath = "$postgresPath\psql.exe"

# Configuración
$dbUser = "postgres"
$dbPassword = "123456.a"
$newDbUser = "farmagest_user"
$newDbPassword = "farmagest123"

Write-Host "Configuracion:" -ForegroundColor Cyan
Write-Host "  Usuario PostgreSQL: $dbUser" -ForegroundColor White
Write-Host "  Nuevo usuario: $newDbUser" -ForegroundColor White
Write-Host "  Contraseña nuevo usuario: $newDbPassword" -ForegroundColor White
Write-Host ""

# Verificar que la base de datos existe
Write-Host "Verificando que la base de datos 'farmagest' existe..." -ForegroundColor Yellow
$env:PGPASSWORD = $dbPassword
$dbExists = & $psqlPath -U $dbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='farmagest';" 2>&1

if ($dbExists -notmatch "1") {
    Write-Host "[ERROR] La base de datos 'farmagest' no existe." -ForegroundColor Red
    Write-Host "Por favor, ejecuta primero el script de creacion de base de datos." -ForegroundColor Yellow
    $env:PGPASSWORD = ""
    exit 1
}

Write-Host "[OK] Base de datos encontrada" -ForegroundColor Green
Write-Host ""

# Verificar si el usuario ya existe
Write-Host "Verificando si el usuario '$newDbUser' ya existe..." -ForegroundColor Yellow
$userExists = & $psqlPath -U $dbUser -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$newDbUser';" 2>&1

if ($userExists -match "1") {
    Write-Host "[ADVERTENCIA] El usuario '$newDbUser' ya existe." -ForegroundColor Yellow
    Write-Host "Eliminando usuario existente..." -ForegroundColor Yellow
    
    # Revocar privilegios y eliminar usuario
    & $psqlPath -U $dbUser -d postgres -c "REVOKE ALL PRIVILEGES ON DATABASE farmagest FROM $newDbUser;" 2>&1 | Out-Null
    & $psqlPath -U $dbUser -d farmagest -c "REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM $newDbUser;" 2>&1 | Out-Null
    & $psqlPath -U $dbUser -d postgres -c "DROP USER IF EXISTS $newDbUser;" 2>&1 | Out-Null
    
    Write-Host "[OK] Usuario eliminado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Creando usuario '$newDbUser'..." -ForegroundColor Yellow

# Crear usuario
$createUserSQL = "CREATE USER $newDbUser WITH PASSWORD '$newDbPassword';"
$result = & $psqlPath -U $dbUser -d postgres -c $createUserSQL 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Usuario creado exitosamente" -ForegroundColor Green
    
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
    
    Write-Host ""
    Write-Host "=== Usuario Creado Exitosamente ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usuario: $newDbUser" -ForegroundColor Green
    Write-Host "Contraseña: $newDbPassword" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuracion para tu aplicacion:" -ForegroundColor Cyan
    Write-Host "  Host: localhost" -ForegroundColor White
    Write-Host "  Puerto: 5432" -ForegroundColor White
    Write-Host "  Base de datos: farmagest" -ForegroundColor White
    Write-Host "  Usuario: $newDbUser" -ForegroundColor White
    Write-Host "  Contraseña: $newDbPassword" -ForegroundColor White
    Write-Host ""
    Write-Host "Para conectarte con este usuario:" -ForegroundColor Cyan
    Write-Host "  psql -U $newDbUser -d farmagest" -ForegroundColor White
    Write-Host ""
    
    # Verificar conexión
    Write-Host "Verificando conexion..." -ForegroundColor Yellow
    $env:PGPASSWORD = $newDbPassword
    $testConnection = & $psqlPath -U $newDbUser -d farmagest -c "SELECT current_user, current_database();" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Conexion verificada exitosamente" -ForegroundColor Green
    } else {
        Write-Host "[ADVERTENCIA] Hubo un problema al verificar la conexion" -ForegroundColor Yellow
    }
    
} else {
    Write-Host ""
    Write-Host "[ERROR] No se pudo crear el usuario" -ForegroundColor Red
    Write-Host "Error: $result" -ForegroundColor Red
}

# Limpiar variable de entorno
$env:PGPASSWORD = ""

Write-Host ""
pause

