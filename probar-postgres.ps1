# Script de prueba para verificar PostgreSQL
Write-Host "=== Prueba de Conexion PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

$postgresPath = "C:\Program Files\PostgreSQL\18\bin"
$psqlPath = "$postgresPath\psql.exe"

if (-not (Test-Path $psqlPath)) {
    Write-Host "ERROR: No se encontro psql.exe" -ForegroundColor Red
    exit 1
}

Write-Host "1. Verificando version de psql..." -ForegroundColor Yellow
& $psqlPath --version
Write-Host ""

Write-Host "2. Intentando conectar sin contraseña..." -ForegroundColor Yellow
Write-Host "   (Si pide contraseña, presiona Enter vacio)" -ForegroundColor Gray
Write-Host ""

# Intentar una conexión simple
$result = & $psqlPath -U postgres -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Conexion exitosa!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Version de PostgreSQL:" -ForegroundColor Cyan
    $result | Select-Object -First 3
    Write-Host ""
    
    Write-Host "3. Listando bases de datos existentes..." -ForegroundColor Yellow
    & $psqlPath -U postgres -d postgres -c "\l" 2>&1 | Select-Object -First 10
    Write-Host ""
    
    Write-Host "4. Verificando si farmagest existe..." -ForegroundColor Yellow
    $dbExists = & $psqlPath -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='farmagest';" 2>&1
    
    if ($dbExists -match "1") {
        Write-Host "[INFO] La base de datos 'farmagest' ya existe" -ForegroundColor Yellow
    } else {
        Write-Host "[INFO] La base de datos 'farmagest' NO existe" -ForegroundColor Cyan
    }
    
    Write-Host ""
    Write-Host "=== PostgreSQL esta funcionando correctamente! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ahora puedes ejecutar el script de creacion:" -ForegroundColor Cyan
    Write-Host "  .\ejecutar-creacion.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "O manualmente:" -ForegroundColor Cyan
    Write-Host "  psql -U postgres -f crear-todo-farmagest.sql" -ForegroundColor White
    
} else {
    Write-Host "[ERROR] No se pudo conectar" -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalles del error:" -ForegroundColor Yellow
    $result | Select-Object -First 5
    Write-Host ""
    Write-Host "Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "  1. Verifica que el servicio este corriendo" -ForegroundColor White
    Write-Host "  2. Intenta conectarte manualmente: psql -U postgres" -ForegroundColor White
    Write-Host "  3. Si pide contraseña, intenta con Enter vacio" -ForegroundColor White
}

Write-Host ""
pause

