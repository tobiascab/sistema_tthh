# 🌱 GUÍA DE SEED DE DATOS

Esta guía explica cómo poblar la base de datos con datos de prueba realistas para el Sistema TTHH.

---

## 📋 Contenido del Seed

El script `database/seed_data.sql` crea:

### 👥 8 Empleados
- **3 Roles Especiales**:
  - `admin.tthh` (Jefe TTHH)
  - `gerencia` (Gerente General)
  - `auditoria` (Auditor Interno)
- **5 Colaboradores**:
  - `juan.perez` (Tecnología)
  - `maria.gonzalez` (Operaciones)
  - `carlos.rodriguez` (Ventas)
  - `ana.martinez` (Atención al Cliente)
  - `luis.fernandez` (Contabilidad)

### 📚 Datos Relacionados
- **Recibos de Salario**: Histórico 2024 para Juan y María
- **Formación Académica**: Títulos universitarios y postgrados
- **Certificaciones**: AWS, Java, Ventas (algunas vencidas)
- **Idiomas**: Español, Inglés, Portugués, Guaraní
- **Habilidades**: Skills técnicas y blandas con niveles 1-5
- **Capacitaciones**: Cursos internos y externos
- **Solicitudes**: Vacaciones, permisos, certificados (estados variados)
- **Auditoría**: Logs de ejemplo

---

## 🚀 Cómo Ejecutar

### Opción A: phpMyAdmin (Recomendado)

1. Abrir **http://localhost/phpmyadmin**
2. Seleccionar la base de datos `sistema_tthh`
3. Ir a la pestaña **"Importar"**
4. Seleccionar el archivo: `C:\SISTEMA_TTHH_V2\database\seed_data.sql`
5. Click en **"Continuar"**

### Opción B: Línea de Comandos

```bash
cd C:\xampp\mysql\bin
mysql -u root -p sistema_tthh < C:\SISTEMA_TTHH_V2\database\seed_data.sql
```

---

## 🧪 Usuarios para Pruebas

| Usuario (Email) | Rol | Perfil |
|-----------------|-----|--------|
| `admin.tthh@coopreducto.com` | TTHH | Acceso total, gestión de nómina |
| `gerencia@coopreducto.com` | GERENCIA | Dashboards, reportes, aprobaciones |
| `auditoria@coopreducto.com` | AUDITORIA | Logs, reportes de solo lectura |
| `juan.perez@coopreducto.com` | COLABORADOR | Perfil técnico, certificaciones vigentes |
| `maria.gonzalez@coopreducto.com` | COLABORADOR | Perfil operativo, recibos disponibles |
| `carlos.rodriguez@coopreducto.com` | COLABORADOR | Certificaciones vencidas (para alertas) |

---

## ⚠️ Nota Importante

Este script **BORRA** (TRUNCATE) los datos existentes en las tablas antes de insertar los nuevos. Úsalo solo en entorno de desarrollo/pruebas.
