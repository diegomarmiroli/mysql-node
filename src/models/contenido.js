const path = require('path');
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Categoria = require('./categoria');
const Genero = require('./genero');
const Actor = require('./actor');
const [ActoresContenido, GenerosContenido] = require('./union-models');

const Contenido = sequelize.define('Contenido', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    poster: {
        type: DataTypes.STRING,
        allowNull: false,
        get () {
            // Agregar un valor constante al campo 'poster' al recuperar el registro
            const poster = this.getDataValue('poster'); // Obtener el valor original del campo 'poster'
            return path.join(process.env.FILE_URL, poster); // Agregar un prefijo
        }
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resumen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    trailer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    temporadas: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categoria', // Nombre de la tabla referenciada
            key: 'id' // Nombre de la columna referenciada
        }
    }
}, {
    timestamps: false,
    tableName: 'contenido'
});

Categoria.hasMany(Contenido, { foreignKey: 'idCategoria' });
Contenido.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoria' });

Genero.belongsToMany(Contenido, { through: GenerosContenido, foreignKey: 'idGenero' });
Contenido.belongsToMany(Genero, { through: GenerosContenido, foreignKey: 'idContenido', as: 'generos' });

Actor.belongsToMany(Contenido, { through: ActoresContenido, foreignKey: 'idActor' });
Contenido.belongsToMany(Actor, { through: ActoresContenido, foreignKey: 'idContenido', as: 'reparto' });

module.exports = Contenido;
