const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const Genero = require('../models/genero');
const [, GenerosContenido] = require('../models/union-models');

// Obtener todos los generos
router.get('/', async (req, res) => {
    try {
        const generos = await Genero.findAll();

        if (!generos.length) {
            res.status(404).json({ message: "There aren't any genres availables." });
            return;
        }
        res.status(200).json(generos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find genres.' });
    }
});

// Buscar generos por nombre
router.get('/:nombre', async (req, res) => {
    const { nombre } = req.params;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    try {
        const generos = await Genero.findAll(
            {
                where: {
                    nombre: {
                        [Op.like]: `%${nombre}%`
                    }
                }
            }
        );
        if (!generos.length) {
            res.status(404).json({ message: "There aren't any genres availables." });
            return;
        }
        res.status(200).json(generos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find genres.' });
    }
});

// Crear un nuevo genero
router.post('/', async (req, res) => {
    const { nombre } = req.query;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    try {
        const [genero, created] = await Genero.findOrCreate({ where: { nombre } });
        if (created) {
            res.status(201).json({ message: 'The genre is registered successfully', genero });
        } else {
            res.status(200).json({ message: 'The genre already exists', genero });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to create a genre.' });
    }
});

// Actualizar un genero por su ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: 'The id is invalid. Please try again.' });
        return;
    }

    const { nombre } = req.query;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    try {
        const [updated] = await Genero.update({ nombre }, { where: { ID: id } });
        if (updated) {
            res.status(200).json({ message: 'The genre was modified successfully.' });
        } else {
            res.status(404).json({ message: 'The id does not correspond to any genre' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to update the genre.' });
    }
});

// Eliminar un genero por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: 'The id is invalid. Please try again.' });
        return;
    }

    try {
        const data = await GenerosContenido.findAll({ where: { idGenero: id } });

        if (data.length) {
            res.status(500).json({ message: 'You cannot delete the genre because it is related to a catalog' });
            return;
        }
        const deleted = await Genero.destroy({ where: { ID: id } });
        if (deleted) {
            res.status(200).json({ message: 'The genre was deleted successfully.' });
        } else {
            res.status(404).json({ message: 'The id does not correspond to any genre' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to delete the genre.' });
    }
});
module.exports = router;
