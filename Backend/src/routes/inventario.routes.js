import {Router} from 'express';
import inventarioController from '../controllers/inventarioController';

const router = Router();

router.get('/', inventarioController.getInventario);
router.get('/barras/:id', inventarioController.getInventarioByBarras);
router.get('/personalizado', inventarioController.getInventarioPersonalizado);
router.get('/personalizado/:id', inventarioController.getInventarioPersonalizadoByBarras);

export default router;
