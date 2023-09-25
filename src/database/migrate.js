const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};

// Lee el archivo SQL
const sqlFile = fs.readFileSync('./trailerflix-model.sql', 'utf8').replace(/\n/g /* Elimino los saltos de linea */, ' ');
const sqlStatements = sqlFile.split(';'); // Separo las consultas
console.log(sqlStatements);

async function createDatabase () {
    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    sqlStatements.forEach(async sql => { // Creo toda la estructura de la base de datos
        if (sql.trim() !== '') {
            const [res] = await connection.query(sql);
            console.log(res);
        }
    });

    /// Leer el archivo JSON con los datos
    const jsonData = fs.readFileSync('./trailerflix_-_Clase_27.json', 'utf8');
    const data = JSON.parse(jsonData);

    try {
    // Iniciar la transacción
        await connection.beginTransaction();

        for (const item of data) { // Recorro todos los items del JSON
            // Insertar datos en la tabla 'categorias'
            let idCategoria;
            let sql = 'SELECT * FROM categorias WHERE LOWER(nombre) = ?';

            const [rows] = await connection.execute(sql, [item.categoria.toLowerCase()]);

            if (!rows.length) {
                const [res] = await connection.execute('INSERT INTO categorias (nombre) VALUES (?)', [item.categoria]);
                idCategoria = res.insertId;
                console.log('Categoria insertada', idCategoria);
            } else {
                idCategoria = rows[0].id;
                console.log('Categoria duplicada', idCategoria);
            }

            // Insertar datos en la tabla 'contenido'
            const poster = item.poster;
            const titulo = item.titulo;
            const resumen = item.resumen;
            const temporadas = item.temporadas === 'N/A' ? null : item.temporadas;

            sql = 'INSERT INTO contenido (poster, titulo, resumen, temporadas, idCategoria) VALUES (?, ?, ?, ?, ?)';

            const [res] = await connection.execute(sql, [poster, titulo, resumen, temporadas, idCategoria]);
            // Buscar el ID del contenido recién insertado
            const idContenido = res.insertId;
            console.log('Contenido insertado', idContenido);

            // Insertar datos en la tabla 'generosContenido'
            const generos = item.genero.split(', ');
            for (const genero of generos) {
                sql = 'SELECT * FROM generos WHERE LOWER(nombre) = ?';
                const [rows] = await connection.execute(sql, [genero]);
                let idGenero;
                if (!rows.length) {
                    sql = 'INSERT INTO generos (nombre) VALUES (?)';
                    const [res] = await connection.execute(sql, [genero.toLowerCase()]);

                    idGenero = res.insertId;
                    console.log('Genero insertado', idGenero);
                } else {
                    idGenero = rows[0].id;
                    console.log('Genero insertado', idGenero);
                }
                sql = 'INSERT INTO generosContenido (idContenido, idGenero) VALUES (?, ?)';
                await connection.execute(sql, [idContenido, idGenero]);
                console.log(`Genero ${idGenero} vinculado al contenido ${idContenido}`);
            }
            // Insertar datos en la tabla 'actoresContenido'
            const actores = item.reparto.split(', ');
            for (const actor of actores) {
                sql = 'SELECT * FROM actores WHERE LOWER(nombre) = ?';
                const [rows] = await connection.execute(sql, [actor.toLowerCase()]);
                let idActor;
                if (!rows.length) {
                    sql = 'INSERT INTO actores (nombre) VALUES (?)';
                    const [res] = await connection.execute(sql, [actor]);

                    idActor = res.insertId;
                    console.log('Actor insertado', idActor);
                } else {
                    idActor = rows[0].id;
                    console.log('Actor insertado', idActor);
                }
                sql = 'INSERT INTO actoresContenido (idContenido, idActor) VALUES (?, ?)';
                await connection.execute(sql, [idContenido, idActor]);
                console.log(`Actor ${idActor} vinculado al contenido ${idContenido}`);
            }
        }
        // Confirmar la transacción
        await connection.commit();

        console.log('Transacción completada exitosamente.');
    } catch (error) {
    // Revertir la transacción en caso de error
        await connection.rollback();
        throw error;
    } finally {
    // Cerrar la conexión
        await connection.end();
    }
}

module.exports = [createDatabase];
