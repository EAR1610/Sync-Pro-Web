import { Router } from 'express';
import vendedorController from '../controllers/vendedorController';

const router = Router();

router
    .route("/")
    .get(vendedorController.getVendedores);

router
    .route('/id/:id')
    .get(vendedorController.getVendedorById);

export default router;