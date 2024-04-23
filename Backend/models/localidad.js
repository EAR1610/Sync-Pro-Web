import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const Localidad = sequelize.define('Localidad', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

},{
    timestamps: false,
    tableName: 'Localidad',
  })

export default Localidad;