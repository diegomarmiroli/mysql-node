# Node.JS and MySQL project for Argentina Programa 4.0

## Configuración

Asegúrate de haber realizado la configuración inicial antes de utilizar la API. Esto incluye la instalación de las dependencias y la configuración de variables de entorno. Puedes encontrar un archivo `.env` que contiene las variables de entorno necesarias.

```shell
# Instalación de dependencias
npm install
```

### Variables de Entorno

La aplicación utiliza variables de entorno para configurar diferentes aspectos de su funcionamiento. A continuación, se describen las variables de entorno necesarias y su significado.

- **PORT**: El puerto en el que la aplicación se ejecutará. Por defecto, se establece en `5000`.

    ```shell
    PORT=5000
    ```

- **HOST**: La dirección IP o el host en el que la aplicación estará disponible. Por defecto, se establece en `127.0.0.1`.

    ```shell
    HOST=127.0.0.1
    ```

- **DB_USER**: El nombre de usuario para la base de datos.

    ```shell
    DB_USER=root
    ```

- **DB_PASS**: La contraseña del usuario de la base de datos.

    ```shell
    DB_PASS=123
    ```

- **DB_NAME**: El nombre de la base de datos que la aplicación utilizará.

    ```shell
    DB_NAME=trailerflix
    ```

- **DB_HOST**: La dirección del servidor de la base de datos. Por defecto, se establece en `localhost`.

    ```shell
    DB_HOST=localhost
    ```

- **DB_PORT**: El puerto en el que la base de datos está escuchando. Por defecto, se establece en `3306`.

    ```shell
    DB_PORT=3306
    ```

- **FILE_URL**: La URL base para acceder a archivos o recursos. En este caso, se utiliza para acceder a archivos relacionados con la aplicación.

    ```shell
    FILE_URL=https://trailerflix.com/
    ```

Asegúrate de configurar estas variables de entorno correctamente en tu archivo `.env` antes de iniciar la aplicación. Puedes modificar los valores según tus necesidades específicas.

## Inicialización del Servidor

El servidor se inicializa automáticamente al ejecutar la aplicación. Esto incluye la conexión a la base de datos o la creación de la base de datos si no existe. Para probar la API con los datos iniciales, corrobore que no tenga una base de datos llamada `trailerflix`.

## Endpoints

Todas las rutas mencionadas devuelven resultados en formato JSON y manejan diferentes casos de error, como catálogos vacíos o parámetros inválidos.

---

## Endpoint `/catalogo`

El endpoint /catalogo ofrece las siguientes funcionalidades:

### Obtener Catálogo Completo (GET /catalogo/)

> Método: GET

> Descripción: Devuelve el catálogo completo de contenidos. Los datos se obtienen de la tabla catalogo en la base de datos.

> ```shell GET http://localhost:5000/catalogo/```

### Obtener Catálogo por ID (GET /catalogo/:id)

> Método: GET

> Descripción: Permite obtener un contenido específico del catálogo según su ID. También se realiza un mapeo de los datos para incluir la URL del póster.

> ```shell GET http://localhost:5000/catalogo/1```

### Buscar Catálogo por Nombre (GET /catalogo/nombre/:nombre)

> Método: GET

> Descripción: Permite buscar contenidos en el catálogo por su nombre. Los resultados se devuelven en un arreglo y se mapean para incluir la URL del póster.

> ```shell GET http://localhost:5000/catalogo/nombre/Película```


### Buscar Catálogo por Género (GET /catalogo/genero/:genero)

> Método: GET

> Descripción: Permite buscar contenidos en el catálogo por género. Los resultados se devuelven en un arreglo y se mapean para incluir la URL del póster.

> ```shell GET http://localhost:5000/catalogo/genero/Acción```

### Buscar Catálogo por Categoría (GET /catalogo/categoria/:categoria)

> Método: GET

> Descripción: Permite buscar contenidos en el catálogo por categoría. Los resultados se devuelven en un arreglo y se mapean para incluir la URL del póster.

> ```shell GET http://localhost:5000/catalogo/categoria/Drama```

---

## Endpoint `/reparto`

Este endpoint permite gestionar la información de los actores registrados en la aplicación.

### Obtener Todos los Actores (GET `/reparto/`)

> Método: GET

> Descripción: Este endpoint devuelve una lista de todos los actores registrados en la aplicación.

> ```shell GET http://localhost:5000/reparto/```

### Obtener actores por filtro de nombre (GET `/reparto/:nombre/`)

> Método: GET

> Descripción: Este endpoint devuelve una lista de todos los actores filtrados por el nombre proporcionado.

> ```shell GET http://localhost:5000/reparto/chris```

### Agregar un nuevo actor (POST `/reparto?nombre=`)

> Método: POST

> Descripción: Este endpoint agrega un nuevo actor si no existe a la base de datos. Recibe solo nombre y debe ser entre 1 y 255 caracteres.

> ```shell POST http://localhost:5000/reparto/christopher nolan```

### Modificar un actor existente (PUT `/reparto/:id?nombre=`)

> Método: PUT

> Descripción: Este endpoint modifica un actor filtrado por el id proporcionado. Recibe nombre y debe ser entre 1 y 255 caracteres.

> ```shell PUT http://localhost:5000/reparto/1?nombre=Christopher Nolan```

### Eliminar un actor existente (DELETE `/reparto/:id`)

> Método: DELETE

> Descripción: Este endpoint elimina un actor filtrado por el id proporcionado, siempre y cuando no exista en algun catalogo.

> ```shell DELETE http://localhost:5000/reparto/1```

---

## Endpoint `/categoria`

Este endpoint permite gestionar la información de las categorias registradas en la aplicación.

### Obtener Todas las categorias (GET `/categoria/`)

> Método: GET

> Descripción: Este endpoint devuelve una lista de todas las categorias registradas en la aplicación.

> ```shell GET http://localhost:5000/categoria/```

### Obtener categorias por filtro de nombre (GET `/categoria/:nombre/`)

> Método: GET

> Descripción: Este endpoint devuelve una lista de todas las categorias filtradas por el nombre proporcionado.

> ```shell GET http://localhost:5000/categoria/serie```

### Agregar una nueva categoria (POST `/categoria?nombre=`)

> Método: POST

> Descripción: Este endpoint agrega una nueva categoria si no existe a la base de datos. Recibe solo nombre y debe ser entre 1 y 255 caracteres.

> ```shell POST http://localhost:5000/categoria/documentales```

### Modificar una categoria existente (PUT `/categoria/:id?nombre=)

> Método: PUT

> Descripción: Este endpoint modifica una categoria filtrada por el id proporcionado. Recibe nombre y debe ser entre 1 y 255 caracteres.

> ```shell PUT http://localhost:5000/categoria/1?nombre=Documental```

### Eliminar una categoria existente (DELETE `/categoria/:id`)

> Método: DELETE

> Descripción: Este endpoint elimina una categoria filtrada por el id proporcionado, siempre y cuando no exista en algun catalogo.

> ```shell DELETE http://localhost:5000/categoria/1```

---

## Endpoint `/genero`

Este endpoint permite gestionar la información de los generos registrados en la aplicación.

### Obtener Todos los generos (GET `/genero/`)

> Método: GET

> Descripción: Este endpoint devuelve una lista de todos los generos registrados en la aplicación.

> ```shell GET http://localhost:5000/genero/```

### Obtener generos por filtro de nombre (GET `/genero/:nombre/`)

> Método: GET

> Descripción: Este endpoint devuelve una lista de todos los generos filtrados por el nombre proporcionado.

> ```shell GET http://localhost:5000/genero/ciencia```

### Agregar un nuevo genero (POST `/genero?nombre=`)

> Método: POST

> Descripción: Este endpoint agrega un nuevo genero si no existe a la base de datos. Recibe solo nombre y debe ser entre 1 y 255 caracteres.

> ```shell POST http://localhost:5000/genero?nombre=anime```

### Modificar un genero existente (PUT `/genero/:id?nombre=`)

> Método: PUT

> Descripción: Este endpoint modifica un genero filtrado por el id proporcionado. Recibe nombre y debe ser entre 1 y 255 caracteres.

> ```shell PUT http://localhost:5000/genero/1?nombre=Anime```

### Eliminar un genero existente (DELETE `/genero/:id`)

> Método: DELETE

> Descripción: Este endpoint elimina un genero filtrado por el id proporcionado, siempre y cuando no exista en algun catalogo.

> ```shell DELETE http://localhost:5000/genero/1```