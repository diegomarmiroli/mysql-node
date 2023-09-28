const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const Categoria = require('../models/categoria');
const Contenido = require('../models/contenido');

router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find categories.' });
    }
});

router.get('/:nombre', async (req, res) => {
    const { nombre } = req.params;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    try {
        const categorias = await Categoria.findAll(
            {
                where: {
                    nombre: {
                        [Op.like]: `%${nombre}%`
                    }
                }
            }
        );
        res.status(200).json(categorias);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to find categories.' });
    }
});

router.post('/', async (req, res) => {
    const { nombre } = req.query;

    if (nombre.trim() === '') {
        res.status(400).json({ message: 'The name must have least 1 character. Please try again.' });
        return;
    }

    try {
        const [categoria, created] = await Categoria.findOrCreate({ where: { nombre } });
        if (created) {
            res.status(201).json({ message: 'The category is registered successfully', categoria });
        } else {
            res.status(200).json({ message: 'The category already exists', categoria });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to create a category.' });
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
        const [updated] = await Categoria.update({ nombre }, { where: { ID: id } });
        if (updated) {
            res.status(200).json({ message: 'The category was modified successfully.' });
        } else {
            res.status(404).json({ message: 'The id does not correspond to any category' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to update the category.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: 'The id is invalid. Please try again.' });
        return;
    }

    try {
        const data = await Contenido.findAll({ where: { idCategoria: id } });

        if (data.length) {
            res.status(500).json({ message: 'You cannot delete the category because it is related to a catalog' });
            return;
        }
        const deleted = await Categoria.destroy({ where: { ID: id } });
        if (deleted) {
            res.status(200).json({ message: 'The category was deleted successfully.' });
        } else {
            res.status(404).json({ message: 'The id does not correspond to any category' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error was ocurred to delete the category.' });
    }
});

module.exports = router;
