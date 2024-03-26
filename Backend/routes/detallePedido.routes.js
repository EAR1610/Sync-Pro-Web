import { Router } from "express";
import detallePedidosController from "../controllers/detallePedidosController";
import checkAuth from '../middleware/checkAuth.js';

const router = Router();

router
    .route('/')
    .get(checkAuth, detallePedidosController.listarDetallePedidos); 

router
    .route('/save')
    .post(checkAuth, detallePedidosController.guardarDetallePedido);

router
    .route('/delete/:id')
    .delete(checkAuth, detallePedidosController.eliminarDetallePedido);
    
export default router;