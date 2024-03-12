import { Router } from 'express';
import inventarioController from '../controllers/inventarioController';
import checkAuth from '../middleware/checkAuth';

const router = Router();

router
    .route('/')
    .get(checkAuth, inventarioController.getInventario);

router
    .route('/barras/:id')
    .get(checkAuth, inventarioController.getInventarioByBarras);

router
    .route('/personalizado')
    .get(checkAuth, inventarioController.getInventarioPersonalizado);

router
    .route('/personalizado/:id')
    .get(checkAuth, inventarioController.getInventarioPersonalizadoByBarras);


export default router;
