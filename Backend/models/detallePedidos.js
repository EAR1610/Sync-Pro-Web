import { DataTypes } from 'sequelize';
import sequelize from '../config/config';

const DetallePedido = sequelize.define('DetallePedisos', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    IdPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    CodArticulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    PrecioVenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'DetallePedisos',
});

export default DetallePedido;