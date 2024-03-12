import express from 'express';
import cors from 'cors';

//Importar rutas
import authRoutes from "./routes/auth.routes";
import sequelize from './config/config';
import dashboardRoutes from './routes/inventario.routes'
  
  sequelize.sync({ force: false }) // Utiliza { force: true } para recrear las tablas en cada reinicio
    .then(() => {
      console.log('Tablas sincronizadas con la base de datos');
    })
    .catch((error) => {
      console.error('Error al sincronizar tablas:', error);
    });
  
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.json({
        author: 'hugo',
        descripcion:'hola mundo'
    })
})

app.use('/dashboard', dashboardRoutes);
app.use('/auth',authRoutes);


export default app;