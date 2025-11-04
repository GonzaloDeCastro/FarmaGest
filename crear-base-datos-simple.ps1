# Script simplificado para crear la base de datos FarmaGest
# No requiere permisos de administrador

Write-Host "=== Creacion de Base de Datos FarmaGest ===" -ForegroundColor Cyan
Write-Host ""

# Buscar PostgreSQL
$postgresPath = "C:\Program Files\PostgreSQL\18\bin"
if (-not (Test-Path "$postgresPath\psql.exe")) {
    Write-Host "ERROR: No se encontro PostgreSQL 18" -ForegroundColor Red
    exit 1
}

$psqlPath = "$postgresPath\psql.exe"

Write-Host "PostgreSQL encontrado: $postgresPath" -ForegroundColor Green
Write-Host ""

# Verificar si la base de datos ya existe
Write-Host "Verificando si la base de datos 'farmagest' ya existe..." -ForegroundColor Yellow

# Intentar conexión sin contraseña primero
$dbExists = & $psqlPath -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='farmagest';" 2>&1

if ($LASTEXITCODE -eq 0) {
    if ($dbExists -match "1") {
        Write-Host ""
        Write-Host "[ADVERTENCIA] La base de datos 'farmagest' ya existe." -ForegroundColor Yellow
        Write-Host "¿Deseas eliminarla y recrearla? (s/N): " -NoNewline -ForegroundColor Yellow
        $response = Read-Host
        
        if ($response -eq "s" -or $response -eq "S") {
            Write-Host ""
            Write-Host "Eliminando base de datos existente..." -ForegroundColor Yellow
            
            # Cerrar conexiones activas
            & $psqlPath -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'farmagest' AND pid <> pg_backend_pid();" 2>&1 | Out-Null
            
            # Eliminar base de datos
            $dropResult = & $psqlPath -U postgres -d postgres -c "DROP DATABASE IF EXISTS farmagest;" 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] Base de datos eliminada" -ForegroundColor Green
            } else {
                Write-Host "[ERROR] No se pudo eliminar la base de datos" -ForegroundColor Red
                Write-Host "Error: $dropResult" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "Operacion cancelada." -ForegroundColor Yellow
            exit 0
        }
    }
    
    Write-Host ""
    Write-Host "=== Creando Base de Datos ===" -ForegroundColor Cyan
    Write-Host "Paso 1/2: Creando la base de datos..." -ForegroundColor Yellow
    
    # Ejecutar el script para crear solo la base de datos
    $scriptSoloDB = Join-Path $PSScriptRoot "crear-base-datos-solo.sql"
    $result = & $psqlPath -U postgres -d postgres -f $scriptSoloDB 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[ERROR] Hubo un error al crear la base de datos" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "[OK] Base de datos creada" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Creando Esquema y Tablas ===" -ForegroundColor Cyan
    Write-Host "Paso 2/2: Creando tablas, índices y datos iniciales..." -ForegroundColor Yellow
    
    # Ejecutar el script para crear el esquema
    $scriptEsquema = Join-Path $PSScriptRoot "crear-esquema-farmagest.sql"
    $result = & $psqlPath -U postgres -d farmagest -f $scriptEsquema 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "[OK] Base de datos creada exitosamente!" -ForegroundColor Green
        Write-Host ""
        
        # Verificar que las tablas se crearon
        Write-Host "Verificando tablas creadas..." -ForegroundColor Yellow
        $tableCount = & $psqlPath -U postgres -d farmagest -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>&1
        
        if ($tableCount -match "^\d+$") {
            Write-Host "[OK] Se crearon $tableCount tablas" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "=== Configuracion Completada ===" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "La base de datos 'farmagest' ha sido creada exitosamente." -ForegroundColor Green
        Write-Host ""
        Write-Host "Datos iniciales creados:" -ForegroundColor Cyan
        Write-Host "  - Roles: Administrador, Vendedor, Farmacéutico, Supervisor" -ForegroundColor White
        Write-Host "  - Categorías: Medicamentos, Higiene Personal, Suplementos, etc." -ForegroundColor White
        Write-Host "  - Ciudades: Buenos Aires, Córdoba, Rosario, etc." -ForegroundColor White
        Write-Host "  - Obras Sociales: OSDE, Swiss Medical, Medifé, etc." -ForegroundColor White
        Write-Host ""
        Write-Host "Para conectarte a la base de datos:" -ForegroundColor Cyan
        Write-Host "  psql -U postgres -d farmagest" -ForegroundColor White
        Write-Host ""
        
    } else {
        Write-Host ""
        Write-Host "[ERROR] Hubo un error al crear el esquema" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
        exit 1
    }
    
} else {
    Write-Host ""
    Write-Host "[ERROR] No se pudo conectar a PostgreSQL" -ForegroundColor Red
    Write-Host "Error: $dbExists" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "  1. El servicio de PostgreSQL este corriendo" -ForegroundColor Yellow
    Write-Host "  2. Puedas conectarte con: psql -U postgres" -ForegroundColor Yellow
    Write-Host "  3. Si pide contraseña, intenta con contraseña vacia o la que configuraste" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
pause

