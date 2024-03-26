const { DataTypes } = require('sequelize');

import sequelize from '../config/config.js';

const Clientes = sequelize.define('Clientes', {
    
    CodCliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Cedula: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Observaciones: {
        type: DataTypes.STRING,
    },
    Telefono1: {
        type: DataTypes.STRING,
    },
    Telefono2: {
        type: DataTypes.STRING,
    },
    Celular: {
        type: DataTypes.STRING,
    },
    Email: {
        type: DataTypes.STRING,
    },
    Direccion: {
        type: DataTypes.STRING,
    },
    Credito: {
        type: DataTypes.BOOLEAN,
    },
    LimiteCredito: {
        type: DataTypes.INTEGER,
    },
    PlazoCredito: {
        type: DataTypes.INTEGER,
    },
    TipoPrecio: {
        type: DataTypes.STRING,
    },
    Restriccion: {
        type: DataTypes.STRING,
    },
    CodMoneda: {
        type: DataTypes.STRING,
    },
    Moroso: {
        type: DataTypes.BOOLEAN,
    },
    InHabilitado: {
        type: DataTypes.BOOLEAN,
    },
    FechaIngreso: {
        type: DataTypes.DATE,
    },
    IdLocalidad: {
        type: DataTypes.STRING,
    },
    IdAgente: {
        type: DataTypes.STRING,
    },
    PermiteDescuento: {
        type: DataTypes.BOOLEAN,
    },
    Descuento: {
        type: DataTypes.INTEGER,
    },
    MaxDescuento: {
        type: DataTypes.INTEGER,
    },
    Exonerar: {
        type: DataTypes.BOOLEAN,
    },
    Codigo: {
        type: DataTypes.STRING,
    },
    Contacto: {
        type: DataTypes.STRING,
    },
    TelContacto: {
        type: DataTypes.STRING,
    },
    DPI: {
        type: DataTypes.STRING,
    },
    Categoria: {
        type: DataTypes.STRING,
    }
},
{
    timestamps: false,
    tableName: 'Clientes',
  });

module.exports = Clientes;