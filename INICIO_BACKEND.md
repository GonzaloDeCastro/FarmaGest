# 🚀 Backend Iniciado

## ✅ Estado

El backend debería estar iniciando en el puerto **5000**.

## 📋 Verificación

### 1. Verificar que el servidor está corriendo

Abre una terminal nueva y ejecuta:
```bash
netstat -ano | findstr :5000
```

Si ves una línea con `:5000`, el servidor está corriendo.

### 2. Verificar en el navegador

Abre:
```
http://localhost:5000/api/usuarios/login
```

Deberías ver un mensaje de error (normal, porque no enviaste parámetros), pero significa que el servidor está respondiendo.

### 3. Probar login en la aplicación

Ahora puedes:
1. Ir al frontend en `http://localhost:3000`
2. Intentar hacer login
3. Debería funcionar correctamente

## ⚠️ Si hay errores

### Error de base de datos

Si ves errores de conexión a PostgreSQL:
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `backend/.env`
3. Asegúrate de que la base de datos `farmagest` exista

### Error de puerto en uso

Si el puerto 5000 está ocupado:
1. Cambia el puerto en `backend/.env`: `PORT=5001`
2. Actualiza el frontend en `.env`: `REACT_APP_APIBACKEND=http://localhost:5001`

## 📝 Notas

- El backend está corriendo en segundo plano
- Los logs aparecerán en la terminal donde se inició
- Para detenerlo, presiona `Ctrl+C` en esa terminal

---

**Fecha:** $(Get-Date)
**Puerto:** 5000
**Estado:** ✅ Iniciando





