import { Router } from 'express';
import vendedorController from '../controllers/vendedorController';

const router = Router();

router
    .route("/")
    .get(vendedorController.getVendedores);

export default router;