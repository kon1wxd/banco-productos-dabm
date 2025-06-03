# 💼 Banco - Gestión de Productos Financieros (Frontend Angular)

Aplicación web desarrollada en **Angular 19** que permite visualizar, registrar, editar y eliminar productos financieros ofrecidos por un banco.

---

## 📌 Funcionalidades

- ✅ Listado de productos financieros (con paginación y búsqueda)
- ✅ Búsqueda por nombre o ID
- ✅ Selección de cantidad de registros por página (5, 10, 20)
- ✅ Registro de nuevos productos (con validaciones completas)
- ✅ Edición de productos (con menú contextual y formulario validado)
- ✅ Eliminación con confirmación vía modal
- ✅ Skeleton loaders y diseño responsive (solo perfiles Senior)

---

## 📐 Tecnologías Utilizadas

- **Angular** 19
- **TypeScript**
- **SCSS** para estilos personalizados
- **RxJS** para programación reactiva
- **Jest** para pruebas unitarias
- **HTML semántico y CSS sin frameworks externos**

---

## 🧠 Arquitectura y estructura
- `features/` → componentes de cada funcionalidad
- `core/` → servicios, modelos y utilidades comunes
- `shared/` → componentes reutilizables (como modales)

```bash
src/app/
├── core/          # Servicios, modelos, validaciones personalizadas
├── shared/        # Componentes reutilizables como modales
├── features/      # Páginas y componentes por funcionalidad
├── app-routing.module.ts
└── app.module.ts
```
---

## 🚀 Cómo ejecutar el proyecto

### 1. Clona este repositorio

```bash
git clone 
cd banco-productos
``` 

### 2. Instala dependencias

```bash
npm install
``` 

### 3. Ejecuta el frontend

```bash
npm start
``` 

## 🧪 Cómo ejecutar pruebas unitarias

```bash
npm run test
``` 


## 👨‍💻 Autor

**David A. Barreno M.**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/david-barreno/)
