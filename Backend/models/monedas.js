import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const Monedas = sequelize.define('Moneda', {
    Codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ValorCompra: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ValorVenta: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Simbolo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Anulado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    timestamps: false,
    tableName: 'Moneda',
  })

export default Monedas;