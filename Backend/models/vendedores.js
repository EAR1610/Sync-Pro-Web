import { DataTypes } from 'sequelize';
import sequelize from '../config/config';

const Vendedores = sequelize.define('Vendedor', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    Cedula: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefono: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Celular: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Comision: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Inhabilitado: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    Correo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Comision2: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    DiasdeGracia: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    TipoComision: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Meta: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    PorcXMeta: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    PorProdoPorc: {
        type: DataTypes.FLOAT,
        allowNull: true
    }

},
{
    timestamps: false,
    tableName: 'Vendedores',
  });

module.exports = Vendedores;