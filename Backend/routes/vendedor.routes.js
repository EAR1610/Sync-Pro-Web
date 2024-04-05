import { Router } from 'express';
import vendedorController from '../controllers/vendedorController';

const router = Router();

router
    .route("/")
    .get(vendedorController.getIdAndNameSellers);

router
    .route("/full_details")
    .get(vendedorController.getSellers);

router
    .route('/id/:id')
    .get(vendedorController.getSellerById);

router
    .route('/save')
    .post(vendedorController.saveSeller);

router
    .route('/delete/:id')
    .delete(vendedorController.deleteSeller);
    
export default router;