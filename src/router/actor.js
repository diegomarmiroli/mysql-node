const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const Actor = require('../models/actor');
const [ActoresContenido] = require('../models/union-models');

router.get('/', async (req, res) => {
    try {
        const reparto = await Actor.findAll();
        res.status(200).json(reparto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find actors.' });
    }
});

router.get('/:nombre', async (req, res) => {
    const { nombre } = req.params;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    try {
        const generos = await Actor.findAll(
            {
                where: {
                    nombre: {
                        [Op.like]: `%${nombre}%`
                    }
                }
            }
        );
        res.status(200).json(generos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find actors.' });
    }
});

router.post('/', async (req, res) => {
    const { nombre } = req.query;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
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
