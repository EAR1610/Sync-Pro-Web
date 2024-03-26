import express from 'express';
import cors from 'cors';

//Importar rutas
import authRoutes from "./routes/auth.routes";
import sequelize from './config/config';
import dashboardRoutes from './routes/inventario.routes'
import empresaRoutes from './routes/empresa.routes'
import reporteVentasRoutes from './routes/reporteVentas.routes';
import vendedorRoutes from './routes/vendedor.routes';
import cajaRoutes from './routes/caja.routes';
import clientesRutas from './routes/cliente.routes';
import pedidosRutas from './routes/pedidos.routes';
import detallePedidosRoutes from './routes/detallePedido.routes';
  
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
app.use('/empresa', empresaRoutes);
app.use('/reporte_ventas', reporteVentasRoutes);
app.use('/vendedor', vendedorRoutes)
app.use('/caja', cajaRoutes)
app.use('/cliente', clientesRutas);
app.use('/pedidos', pedidosRutas);
app.use('/detalle_pedidos', detallePedidosRoutes);

export default app;