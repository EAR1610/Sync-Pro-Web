const { DataTypes } = require('sequelize');
import sequelize from '../config/config.js';

const CategoriaClientes = sequelize.define('CategoriaClientes', {

    NombreCategoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Anulado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},
{
    timestamps: false,
    tableName: 'CategoriaClientes',
  }
)

export default CategoriaClientes;