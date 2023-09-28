const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

const GenerosContenido = sequelize.define('GenerosContenido', {
    idGenero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'generos', // Nombre de la tabla referenciada
            key: 'id' // Nombre de la columna referenciada
        }
    },
    idContenido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'contenido', // Nombre de la tabla referenciada
            key: 'id' // Nombre de la columna referenciada
        }
    }
}, {
    timestamps: false,
    tableName: 'generosContenido'
});
const ActoresContenido = sequelize.define('ActoresContenido', {
    idActor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'actores', // Nombre de la tabla referenciada
            key: 'id' // Nombre de la columna referenciada
        }
    },
    idContenido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'contenido', // Nombre de la tabla referenciada
            key: 'id' // Nombre de la columna referenciada
        }
    }
}, {
    timestamps: false,
    tableName: 'actoresContenido'
});

module.exports = [ActoresContenido, GenerosContenido];
