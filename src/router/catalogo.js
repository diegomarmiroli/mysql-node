const express = require('express');
const router = express.Router();

const sequelize = require('../database/connect');
const { QueryTypes, Op } = require('sequelize');

const Genero = require('../models/genero');
const Categoria = require('../models/categoria');
const Actor = require('../models/actor');
const Contenido = require('../models/contenido');

router.get('/', async (req, res) => {
    try {
        const catalogo = await sequelize.query('SELECT * FROM catalogo', { type: QueryTypes.SELECT });
        res.status(200).json(catalogo.map(e => { return { ...e, poster: `${process.env.FILE_URL}${e.poster}` }; }));
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find the catalog.' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        res.status(400).json({ message: 'The id is invalid. Please try again.' });
        return;
    }

    try {
        const catalogo = await Contenido.findByPk(Number(id),
            {
                attributes: { exclude: ['idCategoria'] },
                include: [
                    {
                        model: Categoria,
                        as: 'categoria'
                    },
                    {
                        model: Genero,
                        as: 'generos',
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    },
                    {
                        model: Actor,
                        as: 'reparto',
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    }
                ]
            }
        );
        res.status(200).json(catalogo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find the catalog.' });
    }
});

router.get('/nombre/:nombre', async (req, res) => {
    const { nombre } = req.params;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    try {
        const catalogo = await Contenido.findAll(
            {
                attributes: { exclude: ['idCategoria'] },
                where: {
                    titulo: {
                        [Op.like]: `%${nombre}%`
                    }
                },
                include: [
                    {
                        model: Categoria,
                        as: 'categoria'
                    },
                    {
                        model: Genero,
                        as: 'generos',
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    },
                    {
                        model: Actor,
                        as: 'reparto',
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    }
                ]
            }
        );
        res.status(200).json(catalogo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find the catalog.' });
    }
});
router.get('/genero/:genero', async (req, res) => {
    const { genero } = req.params;

    if (genero.trim() === '') {
        res.status(400).json({ message: 'The genre must have least 1 character. Please try again.' });
        return;
    }

    try {
        const catalogo = await Contenido.findAll(
            {
                attributes: ['ID'],
                include: [
                    {
                        model: Genero,
                        as: 'generos',
                        where: {
                            nombre: {
                                [Op.like]: `%${genero}%`
                            }
                        },
                        attributes: [],
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    }
                ]
            }
        );

        const catalogoFull = await Contenido.findAll(
            {
                attributes: { exclude: ['idCategoria'] },
                where: {
                    ID: {
                        [Op.in]: catalogo.map(e => e.ID)
                    }
                },
                include: [
                    {
                        model: Categoria,
                        as: 'categoria'
                    },
                    {
                        model: Genero,
                        as: 'generos',
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    },
                    {
                        model: Actor,
                        as: 'reparto',
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    }
                ]
            }
        );
        res.status(200).json(catalogoFull);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find the catalog.' });
    }
});
router.get('/categoria/:categoria', async (req, res) => {
    const { categoria } = req.params;

    if (categoria.trim() === '') {
        res.status(400).json({ message: 'The category must have least 1 character. Please try again.' });
        return;
    }

    try {
        const catalogo = await Contenido.findAll(
            {
                attributes: { exclude: ['idCategoria'] },
                include: [
                    {
                        model: Categoria,
                        as: 'categoria',
                        where: {
                            nombre: {
                                [Op.like]: `%${categoria}%`
                            }
                        }
                    },
                    {
                        model: Genero,
                        as: 'generos',
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    },
                    {
                        model: Actor,
                        as: 'reparto',
                        through: { attributes: [] } // Evita que se incluyan atributos adicionales
                    }
                ]
            }
        );
        res.status(200).json(catalogo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find the catalog.' });
    }
});
router.post('/', async (req, res) => {
    // Primero, obtén las instancias de las categorías, géneros y actores necesarios
    const [categoriaPelicula] = await Categoria.findOrCreate({ where: { nombre: 'Pelicula' } });
    const [generoKawaii] = await Genero.findOrCreate({ where: { nombre: 'Kawaii' } });
    const [actorDiego] = await Actor.findOrCreate({ where: { nombre: 'Diego Marmiroli' } });
    const [actorAnahi] = await Actor.findOrCreate({ where: { nombre: 'Anahi Garcia' } });

    // Ahora crea el contenido con las relaciones
    const nuevoContenido = await Contenido.create({
        poster: 'poster de prueba',
        titulo: 'Titulo de prueba',
        resumen: 'Hola esto es una película',
        temporadas: null,
        idCategoria: categoriaPelicula.ID // Usamos el ID de la categoría encontrada
    });

    // Asocia el contenido con los géneros y actores
    await nuevoContenido.addGenero(generoKawaii);
    await nuevoContenido.addReparto([actorDiego, actorAnahi]);

    Contenido.findOne({
        attributes: { exclude: ['idCategoria'] },
        where: {
            ID: nuevoContenido.ID
        },
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Genero,
                as: 'generos',
                through: { attributes: [] } // Evita que se incluyan atributos adicionales
            },
            {
                model: Actor,
                as: 'reparto',
                through: { attributes: [] } // Evita que se incluyan atributos adicionales
            }
        ]
    }).then(data => {
        res.send(JSON.stringify(data));
    });
});

module.exports = router;
