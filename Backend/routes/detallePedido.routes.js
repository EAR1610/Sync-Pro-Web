import { Router } from "express";
import detallePedidosController from "../controllers/detallePedidosController";
import checkAuth from '../middleware/checkAuth.js';

const router = Router();

router
    .route('/')
    .get(checkAuth, detallePedidosController.getOrderDetails); 

router
    .route('/save')
    .post(checkAuth, detallePedidosController.saveOrderDetails);

router
    .route('/delete/:id')
    .delete(checkAuth, detallePedidosController.deleteOrderDetails);

router
    .route('/list/:id')
    .get(checkAuth, detallePedidosController.getOrderDetailsById);
    
export default router;