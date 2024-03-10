import express from 'express';
import cors from 'cors';

//Importar rutas
import productosRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";
import sequelize from '../src/config' 
import authMiddleware from '../src/middlewares/authMiddleware';
import inventariorioRoutes from './routes/inventario.routes'
  
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

app.use('/inventario', inventariorioRoutes);
app.use('/productos',productosRoutes);
app.use('/auth',authRoutes);


export default app;