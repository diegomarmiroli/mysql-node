const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const Actor = require('../models/actor');
const [ActoresContenido] = require('../models/union-models');

// Obtener todos los actores
router.get('/', async (req, res) => {
    try {
        const reparto = await Actor.findAll();
        if (!reparto.length) {
            res.status(404).json({ message: "There aren't any actors registered." });
            return;
        }
        res.status(200).json(reparto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find actors.' });
    }
});

// Buscar actores por nombre
router.get('/:nombre', async (req, res) => {
    const { nombre } = req.params;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    try {
        const reparto = await Actor.findAll(
            {
                where: {
                    nombre: {
                        [Op.like]: `%${nombre}%`
                    }
                }
            }
        );
        if (!reparto.length) {
            res.status(404).json({ message: "There aren't any actors registered." });
            return;
        }
        res.status(200).json(reparto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find actors.' });
    }
});

// Crear un nuevo actor
router.post('/', async (req, res) => {
    const { nombre } = req.query;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    if (nombre.trim().length > 255) {
        res.status(400).json({ message: 'The name must have max 255 characters. Please try again.' });
        return;
    }

    try {
        const [actor, created] = await Actor.findOrCreate({ where: { nombre } });
        if (created) {
            res.status(201).json({ message: 'The actor is registered successfully', actor });
        } else {
            res.status(200).json({ message: 'The actor already exists', actor });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to create an actor.' });
    }
});

// Actualizar un actor por su ID
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
        const [updated] = await Actor.update({ nombre }, { where: { ID: id } });
        if (updated) {
            res.status(200).json({ message: 'The actor was modified successfully.' });
        } else {
            res.status(404).json({ message: 'The id does not correspond to any actor' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to update the actor.' });
    }
});

// Eliminar un actor por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: 'The id is invalid. Please try again.' });
        return;
    }

    try {
        const data = await ActoresContenido.findAll({ where: { idActor: id } });

        if (data.length) {
            res.status(500).json({ message: 'You cannot delete the actor because it is related to a catalog' });
            return;
        }
        const deleted = await Actor.destroy({ where: { ID: id } });
        if (deleted) {
            res.status(200).json({ message: 'The actor was deleted successfully.' });
        } else {
            res.status(404).json({ message: 'The id does not correspond to any actor' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to delete the actor.' });
    }
});

module.exports = router;
