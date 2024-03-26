import { DataTypes } from 'sequelize';
import sequelize from '../config/config';

const Pedidos = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CodCliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Observaciones: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    IdUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    FechaEntrega: {
        type: DataTypes.DATE,
        allowNull: false
    },
    CodMoneda: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TipoCambio: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false
    },
    Anulado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    idVendedor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},
{
    timestamps: false,
    tableName: 'Pedidos',
  });

module.exports = Pedidos;