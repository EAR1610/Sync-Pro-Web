import { DataTypes } from 'sequelize';
import sequelize from '../config/config';
import bycrypt from 'bcryptjs'

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  claveEntrada: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  claveInterna: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pass_user: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cambiarPrecio: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  porcPrecio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  aplicarDesc: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  porcDesc: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  existNegativa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  anulado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  tema: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  idVendedor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  verTodo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  permitirAbrirVentanas: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  ventasFechaAnterior: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  esAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  diasFacturacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  esEncargado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  idEncargado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  
}, {
  timestamps: false,
  tableName: 'Usuario',
});

Usuario.encryptPassword = async (password) => {
  const salt = await bycrypt.genSalt(10);
  return await bycrypt.hash(password, salt);
}

Usuario.comparePassword = async (password, receivedPassword) => {
  return await bycrypt.compare(password, receivedPassword);
}


export default Usuario;
