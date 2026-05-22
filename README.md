# Sistema de Dictámenes GEM

Este es el sistema para llevar el seguimiento de las solicitudes de dictámenes administrativos.

## Estructura del Proyecto

El sistema está compuesto por un frontend en React (creado con Vite y TailwindCSS) y un backend en Spring Boot (Java).

### Frontend (React + Vite)
El frontend proporciona la interfaz de usuario con diseños amigables, "Glassmorphism", un menú lateral, tableros de auditoría y reportes clave para interactuar con la Base de datos y el Backend de Java.

**Instalación y configuración local (Frontend):**
1. Asegúrate de tener instalado [Node.js](https://nodejs.org/es) (v18 o superior).
2. Abre la terminal en el directorio raíz del proyecto.
3. Ejecuta el comando para instalar las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo del frontend:
   ```bash
   npm run dev
   ```
5. El proyecto se abrirá en tu navegador (por defecto usualmente en `http://localhost:5173`).


### Backend (Java + Spring Boot)

El módulo backend se encuentra en la carpeta `/src-backend`. Su función es manejar la API REST para los listados, guardado, edición y las métricas para los tableros, guardando la información de toda la plataforma en una base de datos de MySQL local.

**Requisitos Previos (Backend):**
1. Java Development Kit (JDK 17).
2. [Maven](https://maven.apache.org/install.html) (Si usas un IDE moderno como IntelliJ IDEA o Eclipse, estos ya traen soporte para Maven embebido).
3. Servidor [MySQL](https://dev.mysql.com/downloads/installer/) corriendo en tu máquina (usuario: `root` y clave: `root` por defecto, ajustable en el backend). 

**Paso a paso para correr el Backend (Local):**
1. Abre MySQL (por ejemplo usando MySQL Workbench o HeidiSQL) y crea la base de datos vacía ejecutando la siguiente consulta:
   ```sql
   CREATE DATABASE db_Dictamenes;
   ```
2. Abre la carpeta `/src-backend` en tu IDE favorito de Java (IntelliJ IDEA, Eclipse, o VS Code con la extensión de Java). El archivo raíz para abrir el proyecto Java es `pom.xml`.
3. Revisa y ajusta si es necesario las credenciales en `/src-backend/main/resources/application.properties`. Por defecto está configurado así:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/db_Dictamenes?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   *(Cambia `root` y `root` por el usuario y contraseña reales de tu instalación local de MySQL).*
4. Si quieres correrlo desde tu línea de comandos dentro del folder `/src-backend`, usa Maven:
   ```bash
   mvn spring-boot:run
   ```
   O bien, ejecuta la clase principal `DictamenesApplication.java` directamente usando el botón 'Run' en tu Entorno de Desarrollo (IDE).
5. El sistema de bases de datos creará las tablas automáticamente (`spring.jpa.hibernate.ddl-auto=update`).
6. El backend se publicará en `http://localhost:8080`.

### Conectando Frontend con Backend

Dado que los archivos proporcionados tienen un Dummy Data estático, una vez que el Backend esté arriba podrás cambiar los servicios o llamadas dentro de React (`fetch` o `axios`) apuntando hacia los endpoints que se crearon:
- `http://localhost:8080/api/solicitudes`
- `http://localhost:8080/api/dashboard/stats`
- `http://localhost:8080/api/auditoria`

### Notas
- Recuerda siempre poner excepciones de CORS si lo hosteas en locales distintos (ya hay excepciones para `*` agregadas al backend por facilidad).

¡Listo! Con estos pasos podrás ejectuar ambos lados de la aplicación en tu entorno local.
