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
    .route('/hide/:id')
    .put(vendedorController.deleteSeller);

router
    .route('/update/:id')
    .put(vendedorController.updateSeller);
    
export default router;