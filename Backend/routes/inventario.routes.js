import { Router } from 'express';
import inventarioController from '../controllers/inventarioController';
import checkAuth from '../middleware/checkAuth';

const router = Router();

router
    .route('/')
    .get(checkAuth, inventarioController.getInventory);

router
    .route('/barras/:id')
    .get(checkAuth, inventarioController.getInventoryByBarcode);

router
    .route('/personalizado')
    .get(checkAuth, inventarioController.getCustomInventory);

router
    .route('/personalizado/:id')
    .get(checkAuth, inventarioController.getCustomInventoryByBarcode);


export default router;
