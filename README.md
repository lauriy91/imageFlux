# Task Processing API

## Descripción
Proyecto con servicios encargados de la gestión de tareas para el procesamiento de imágenes, incluyendo la creación, actualización, consulta de tareas y eliminación de las mismas. Las tareas poseen 3 posibles estados (`pending`, `completed`, `failed`) y un precio asociado.

## Tecnologías Utilizadas
- **NestJS**: Framework para la arquitectura del backend.
- **MongoDB**: Base de datos NoSQL para almacenar las tareas.
- **Docker**: Contenedor para el despliegue del servicio.
- **Jest**: Framework para pruebas unitarias e integración.
- **Kafka**: Broker para la gestión de las tareas.
- **Azure**: Cloud encargado de alojar imagenes y gestionar el despliegue automatizado.
- **Github Actions**: Despliegue automatico.

## Arquitectura elegida del Proyecto: Hexagonal
```
📦 src
 ┣ 📂 application (Controladores y validaciones de entrada)
 ┣ 📂 common (Manejador de excepciones)
 ┣ 📂 domain (Interfaces, modelado, puertos y lógica de negocio)
 ┣ 📂 infrastructure (Conexión a la base de datos, procesador de imagenes, adaptadores)
 ┣ 📂 tests (Pruebas unitarias e integración)
 ┣ 📜 main.ts (Punto de entrada del servicio)
 ┗ 📜 app.module.ts (Módulo principal de la aplicación)
```

## Instalación y Ejecución
### Clonar el repositorio
```sh
git clone https://github.com/lauriy91/imageFlux.git
cd task-processing-service
```

### Instalar dependencias
```sh
npm install
```

### Configurar variables de entorno
Crear un archivo `.env` con el siguiente contenido:
```env
MONGO_URI=mongodb://localhost:27017/image_processing
PORT=3000
```

### Ejecutar en desarrollo
```sh
npm run start:dev
```

### Correr pruebas
```sh
npm run test
```

### Ejecutar con Docker
```sh
docker-compose up --build
```

## Endpoints
### **Crear Tarea**
**POST** `/tasks`
```json
{
   "images": [
    {"resolution": "1024", "path": "/output/image6/1024/f322b730b287.jpg"},
    {"resolution": "800", "path": "/output/image7/800/202fd8b3174.jpg"}
  ],
  "originalPath": "uploads/image5.jpg"
}
```
**Respuesta:**
```json
{
  "taskId": "67ee17f932a1fb13b8533e64",
  "status": "pending",
  "price": 5
}
```

### **Obtener Tarea por id**
**GET** `/tasks/:taskId`
```json
{
  "taskId": "67ee17f932a1fb13b8533e64",
  "status": "completed",
  "price": 20,
  "images": [
    {
      "path": "/output/image6/1024/f322b730b287.jpg"
    },
    {
      "path": "/output/image7/800/202fd8b3174.jpg"
    }
  ]
}
```

### **Obtener Tareas**
**GET** `/tasks`
```json
[
  {
    "_id": "67edfc41cb62af69855d92e9",
    "taskId": "67edfc41cb62af69855d92e9",
    "status": "pending",
    "price": 100,
    "images": "image1.jpg",
    "createdAt": "2025-04-03T03:10:57.181Z",
    "updatedAt": "2025-04-03T03:10:57.181Z"
  },
  {
    "_id": "67edfc6dcb62af69855d92eb",
    "taskId": "67edfc6dcb62af69855d92eb",
    "status": "complete",
    "price": 200,
    "images": "image2.jpg",
    "createdAt": "2025-04-03T03:11:41.961Z",
    "updatedAt": "2025-04-03T03:13:09.465Z"
  },
]

### **Actualizar Tareas**
**PUT** `/tasks/:taskId`
```json
{
  "status": "completed"
}
```
**Respuesta:**
```json
{
  "_id": "67ee17f932a1fb13b8533e63",
  "taskId": "67ee17f932a1fb13b8533e63",
  "status": "completed",
  "price": 5,
  "images": [
    {
      "resolution": "1024",
      "path": "/output/image6/1024/f322b730b287.jpg"
    },
    {
      "resolution": "800",
      "path": "/output/image7/800/202fd8b3174.jpg"
    }
  ],
  "originalPath": "uploads/image5.jpg",
  "createdAt": "2025-04-03T05:09:13.082Z",
  "updatedAt": "2025-04-03T05:09:59.328Z"
}
```

### **Actualizar Tareas**
**PATCH** `/tasks/:taskId`
```json
{
  "status": "completed"
}
```
**Respuesta:**
```json
{
  "_id": "67ee17f932a1fb13b8533e63",
  "taskId": "67ee17f932a1fb13b8533e63",
  "status": "completed",
  "price": 5,
  "images": [
    {
      "resolution": "1024",
      "path": "/output/image6/1024/f322b730b287.jpg"
    },
    {
      "resolution": "800",
      "path": "/output/image7/800/202fd8b3174.jpg"
    }
  ],
  "originalPath": "uploads/image5.jpg",
  "createdAt": "2025-04-03T05:09:13.082Z",
  "updatedAt": "2025-04-03T05:09:59.328Z"
}
```

### **Eliminar Tarea por id**
**DELETE** `/tasks/:taskId`
```Code	Description	Links
200	
Tarea eliminada
```

## Pruebas Unitarias e Integración

Las pruebas se encuentran en el directorio `tests/`. Se han implementado pruebas unitarias para el servicio y pruebas de integración para validar la API completa.

### **Ejecutar Pruebas**
```sh
npm run test
```