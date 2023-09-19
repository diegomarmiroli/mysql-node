CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

CREATE TABLE generos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

CREATE TABLE actores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

CREATE TABLE contenido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  poster VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  resumen VARCHAR(255) NOT NULL,
  temporadas INT NOT NULL,
  idCategoria INT NOT NULL,
  FOREIGN KEY (idCategoria) REFERENCES categorias(id)
);

CREATE TABLE generosContenido (
  idContenido INT NOT NULL,
  idGenero INT NOT NULL,
  FOREIGN KEY (idContenido) REFERENCES contenido(id),
  FOREIGN KEY (idGenero) REFERENCES generos(id)
);

CREATE TABLE actoresContenido (
  idContenido INT NOT NULL,
  idActor INT NOT NULL,
  FOREIGN KEY (idContenido) REFERENCES contenido(id),
  FOREIGN KEY (idActor) REFERENCES actores(id)
);