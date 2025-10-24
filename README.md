# ⚔️ Hollow Knight API

Una aplicación web fullstack inspirada en el universo de *Hollow Knight*, que combina un backend robusto en **Node.js + Express + MongoDB** con un frontend dinámico en **React + Vite + MUI**.
Permite la visualización de personajes, habilidades y regiones del juego y sus características, con autenticación segura, roles de usuario y gestión de los datos meidante paneles de administración.

---

## 🚀 Tecnologías principales

### 🖥️ Frontend

* **React + Vite**.
* MUI como libreria de componentes y su sistema de estilos.
* **React Router** para navegación.

### ⚙️ Backend

* **Node.js + Express**
* **MongoDB + Mongoose**
* **JWT** (access y refresh tokens)
* **bcryptjs** para encriptar contraseñas
* **Cloudinary** para almacenamiento de imágenes
* **CORS** y **dotenv**
* Pruebas con **Jest**

---

## 🧠 Funcionalidades principales

- ✅ Registro, login y logout de usuarios.
- ✅ Autenticación con JWT y refresh token.
- ✅ Roles: usuario y administrador.
- ✅ Visualización de datos.
- ✅ Panel de administración protegido con CRUD de entidades (personajes, habilidades y regiones).
- ✅ Subida y gestión de imágenes con Cloudinary.
- ✅ Variables de entorno para configuración segura.
- ✅ Test implementados a la API.

---

## 🏗️ Arquitectura general

```
Frontend (React + Vite)
       │
       ▼
Backend API (Node.js + Express)
       │
       ▼
MongoDB (local)
       │
       ▼
Cloudinary (para imágenes)
```

---

## ⚙️ Configuración del entorno

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/<tu-repo>.git
cd <tu-repo>
```

### 2️⃣ Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` con las variables necesarias:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hollow_knight
JWT_SECRET=tu_clave_jwt
JWT_REFRESH_SECRET=tu_clave_refresh
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin.1234
DEFAULT_IMAGE_URL=https://res.cloudinary.com/tu_cloud/image/upload/default.webp
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3️⃣ Levantar MongoDB en local

 Asegúrate de tener instalado **MongoDB Community Server**.

1. Abre una nueva terminal y ejecuta:
   ```bash
   mongod
   ```
   Esto iniciará el servicio de MongoDB en el puerto por defecto (`27017`).

3. En tu archivo `.env`, asegúrate de que la variable de entorno esté configurada así:
   ```env
   MONGODB_URI=mongodb://localhost:27017/hollow_knight
   ```
4. Luego inicia tu backend:
   ```bash
   npm start
   ```
MongoDB ahora estará corriendo en tu máquina, y el backend de la API se conectará automáticamente a la base de datos local.



###  Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre en el navegador:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🧩 Endpoints principales

| Método   | Ruta                  | Descripción                |
| -------- | --------------------- | -------------------------- |
| `POST`   | `/api/auth/register`  | Crear usuario              |
| `POST`   | `/api/auth/login`     | Iniciar sesión             |
| `GET`    | `/api/characters`     | Listar personajes          |
| `POST`   | `/api/characters`     | Crear personaje (admin)    |
| `PUT`    | `/api/characters/:id` | Editar personaje (admin)   |
| `DELETE` | `/api/characters/:id` | Eliminar personaje (admin) |
| `GET`    | `/api/characters/:id` | Listar personaje por id    |
| `GET`    | `/api/regions`        | Listar regiones            |
| `POST`   | `/api/regions`        | Crear región (admin)       |
| `PUT`    | `/api/regions/:id`    | Editar región (admin)      |
| `DELETE` | `/api/regions/:id`    | Eliminar región (admin)    |
| `GET`    | `/api/regions/:id`    | Listar región por id       |
| `GET`    | `/api/abilities`      | Listar habilidades         |
| `POST`   | `/api/abilities`      | Crear habilidad (admin)    |
| `PUT`    | `/api/abilities/:id`  | Editar habilidad (admin)   |
| `DELETE` | `/api/abilities/:id`  | Eliminar habilidad (admin) |
| `GET`    | `/api/abilities/:id`  | Listar habilidad por id    |

---

## 🖼️ Vistas
<table>
  <tr>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280357/Login_ki2wmq.png" width="500px"/></td>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280358/home2_fjemji.png" width ="500px"/></td>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280356/404_aj7926.png" width ="500px"/></td>

  </tr>
  <tr>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280355/admin-panel_khyd1k.png" width="500px"/></td>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280360/character-detail_w9qazj.png" width="500px" /></td>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280354/ability-detail_cecnbf.png" width="500px" /></td>
  </tr>
   <tr>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280354/abilities_ovjbv6.png" width="500px"/></td>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280358/regions_gj6xlt.png" width="500px" /></td>
    <td><img src = "https://res.cloudinary.com/dpylotukc/image/upload/v1761280358/characters_lylbkx.png" width="500px" /></td>

  </tr>
</table>









## 🧾 Créditos

Proyecto desarrollado por **Maikol Campos** como práctica.
Inspirado en el universo del videojuego *Hollow Knight*.
No afiliado a Team Cherry.

---

## ⚠️ Notas importantes 

* **Créditos del universo Hollow Knight:**
  Este proyecto está inspirado en el videojuego *Hollow Knight*, creado por **Team Cherry**.
  Todo el contenido del juego (personajes, regiones, habilidades) pertenece a ellos.
  Este proyecto es **solo con fines de práctica y aprendizaje**, desarrollado por mí como amante del juego y para mejorar habilidades en desarrollo web.

* **Cuenta de administrador por defecto:**
  El backend está configurado para crear automáticamente un usuario administrador al levantar el proyecto por primera vez.
  Los datos por defecto se encuentran en el archivo `.env`:
  ```env
  ADMIN_NAME=Administrator
  ADMIN_EMAIL=admin@gmail.com
  ADMIN_PASSWORD=admin.1234
  ```
  Esto permite acceder inmediatamente al panel de administración y gestionar los datos sin necesidad de registrar un usuario manualmente.

