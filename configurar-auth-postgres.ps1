# Script para establecer contraseña de PostgreSQL y crear la base de datos
Write-Host "=== Configuracion de PostgreSQL para FarmaGest ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "PostgreSQL requiere una contraseña pero parece que no se configuro durante la instalacion." -ForegroundColor Yellow
Write-Host ""
Write-Host "Opciones:" -ForegroundColor Cyan
Write-Host "  1. Establecer una contraseña nueva para el usuario 'postgres'" -ForegroundColor White
Write-Host "  2. Cambiar temporalmente la autenticacion a 'trust' (solo para desarrollo)" -ForegroundColor White
Write-Host ""
Write-Host "¿Cual prefieres? (1 o 2): " -NoNewline -ForegroundColor Yellow
$opcion = Read-Host

$postgresPath = "C:\Program Files\PostgreSQL\18\bin"
$dataPath = "C:\Program Files\PostgreSQL\18\data"

if ($opcion -eq "1") {
    Write-Host ""
    Write-Host "=== Establecer Contraseña ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "NOTA: Para establecer la contraseña necesitas acceso al archivo pg_hba.conf" -ForegroundColor Yellow
    Write-Host "o puedes usar pgAdmin o SQL desde un usuario con privilegios." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternativa: Puedes ejecutar manualmente en psql:" -ForegroundColor Cyan
    Write-Host "  ALTER USER postgres WITH PASSWORD 'tu_contraseña';" -ForegroundColor White
    Write-Host ""
    
} elseif ($opcion -eq "2") {
    Write-Host ""
    Write-Host "=== Cambiar Autenticacion a Trust (TEMPORAL) ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ADVERTENCIA: Esto cambiara la autenticacion a 'trust' (sin contraseña)" -ForegroundColor Yellow
    Write-Host "solo para desarrollo local. NO usar en produccion!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "¿Continuar? (s/N): " -NoNewline -ForegroundColor Yellow
    $confirmar = Read-Host
    
    if ($confirmar -eq "s" -or $confirmar -eq "S") {
        Write-Host ""
        Write-Host "Haciendo backup de pg_hba.conf..." -ForegroundColor Yellow
        
        $pgHbaPath = "$dataPath\pg_hba.conf"
        $backupPath = "$dataPath\pg_hba.conf.backup"
        
        if (Test-Path $pgHbaPath) {
            Copy-Item $pgHbaPath $backupPath -Force
            Write-Host "[OK] Backup creado: $backupPath" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "Modificando pg_hba.conf..." -ForegroundColor Yellow
            
            # Leer el archivo
            $content = Get-Content $pgHbaPath
            
            # Cambiar scram-sha-256 por trust solo para local
            $newContent = $content | ForEach-Object {
                if ($_ -match '^\s*(local\s+all\s+all\s+)(scram-sha-256|md5|password)') {
                    $_ -replace '(scram-sha-256|md5|password)', 'trust'
                } elseif ($_ -match '^\s*(host\s+all\s+all\s+127\.0\.0\.1/32\s+)(scram-sha-256|md5|password)') {
                    $_ -replace '(scram-sha-256|md5|password)', 'trust'
                } elseif ($_ -match '^\s*(host\s+all\s+all\s+::1/128\s+)(scram-sha-256|md5|password)') {
                    $_ -replace '(scram-sha-256|md5|password)', 'trust'
                } else {
                    $_
                }
            }
            
            # Guardar el archivo modificado
            $newContent | Set-Content $pgHbaPath -Encoding UTF8
            
            Write-Host "[OK] Archivo modificado" -ForegroundColor Green
            Write-Host ""
            Write-Host "Recargando configuracion de PostgreSQL..." -ForegroundColor Yellow
            
            # Recargar la configuración
            $service = Get-Service -Name "postgresql-x64-18" -ErrorAction SilentlyContinue
            if ($service) {
                # Enviar señal SIGHUP para recargar sin reiniciar
                Write-Host "[INFO] Puedes necesitar reiniciar el servicio manualmente:" -ForegroundColor Yellow
                Write-Host "  Restart-Service -Name postgresql-x64-18" -ForegroundColor White
                Write-Host ""
                Write-Host "O simplemente ejecuta el script de creacion ahora." -ForegroundColor Cyan
            }
            
            Write-Host ""
            Write-Host "[OK] Configuracion cambiada. Ahora puedes ejecutar:" -ForegroundColor Green
            Write-Host "  .\ejecutar-creacion.ps1" -ForegroundColor White
        } else {
            Write-Host "[ERROR] No se encontro pg_hba.conf en: $pgHbaPath" -ForegroundColor Red
        }
    }
} else {
    Write-Host ""
    Write-Host "Opcion cancelada." -ForegroundColor Yellow
}

Write-Host ""
pause

