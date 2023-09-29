const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const app = express();
const sequelize = require('./database/connect');
const catalogRouter = require('./router/catalogo');
const genreRouter = require('./router/genero');
const catRouter = require('./router/categoria');
const actorRouter = require('./router/actor');

const { PORT = 3000, HOST = '127.0.0.1' } = process.env;

// Middleware para JSON
app.use(express.json());
// Middleware para form encoded
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/catalogo', catalogRouter);
app.use('/genero', genreRouter);
app.use('/categoria', catRouter);
app.use('/reparto', actorRouter);

app.use('/*', (req, res) => {
    res.status(404).send('The page not found.');
});

/**
 * Inicializa el servidor conectando a la base de datos o creando
 * esta misma
 */
function startServer () {
    sequelize.authenticate().then(() => { // Si se conecta a la DB inicializa el servidor
        app.listen(PORT, HOST, () => console.log(`Example app listening on port ${PORT}!`));
    }).catch(error => {
        if (error.original.sqlState === '42000') { // Error 42000 (No existe la base de datos)
            const createDatabase = require('./database/migrate');

            createDatabase().then(() => { // Creo la base de datos
                startServer(); // Vuelvo a ejecutar la inciializacion del servidor
            });
        }
        console.log('Error al iniciar servidor:', error.message);
    });
}

startServer();
