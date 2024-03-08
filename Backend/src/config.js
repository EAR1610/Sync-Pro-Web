import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'mssql', 
  host: '85.10.196.212',
  port: '1433',
  username: 'sa',
  password: 'Msuper@_0822',
  database: 'SolucionPymesVacia',
});

export default sequelize;
