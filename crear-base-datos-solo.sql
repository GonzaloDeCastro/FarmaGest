-- Script para crear SOLO la base de datos FarmaGest en PostgreSQL
-- Este script debe ejecutarse conectado a la base de datos 'postgres'
-- Ejecutar este script como usuario postgres o superusuario

-- ============================================
-- CREAR BASE DE DATOS
-- ============================================

-- Eliminar base de datos si existe (CUIDADO: Esto borra todos los datos)
-- DROP DATABASE IF EXISTS farmagest;

-- Crear la base de datos
CREATE DATABASE farmagest
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
