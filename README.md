# 🛠️ OrderBurguer Backend

## 🚀 Requisitos

- **node.js** v22.20.0  
- **pnpm** v10.18.1

## 📦 Instalación

```bash
pnpm install
```

Luego ejecutamos el servidor de desarrollo.

```bash
pnpm dev
```

## 🔐 Variables de entorno

Solicitá los archivos .env necesarios. No están incluidos en el repositorio por seguridad.

## 🧬 Migraciones de Base de Datos
Si vas a trabajar con las tablas o modificarlas:

```bash
pnpm db:generate   # Genera la migración
pnpm db:migrate    # Aplica los cambios
```

## 🌿 Flujo de trabajo
- Nunca trabajes directamente en la rama main.
- Creá una nueva rama con el formato:

```bash
feature-{funcionalidad}
```

- Realizá tus cambios y asegurate de que el código esté limpio:

```bash
pnpm check     # Verifica errores de linter
pnpm format    # Formatea el código
pnpm lint      # Arregla algunos errores (no todos)
```
⚠️ Algunos errores deben corregirse manualmente.

- Subí tu rama y abrí un Pull Request. Yo lo revisaré y lo aprobaremos juntos.

## ✅ Buenas prácticas
Usá nombres descriptivos para tus ramas.

Documentá tus cambios en el PR.

Verificá que no haya errores antes de subir.

Pedí los .env si no los tenés.

## 🧰 Tecnologías usadas

- 🚀 **Express** – Framework para APIs en Node.js  
- 🧠 **TypeScript** – Tipado estático para mayor claridad  
- 🗃️ **Turso** – Base de datos edge basada en SQLite  
- 🧪 **DrizzleORM** – ORM moderno con migraciones typesafe
