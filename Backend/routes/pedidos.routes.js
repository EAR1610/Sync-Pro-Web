import {Router} from 'express'
import pedidosController from '../controllers/pedidosController.js'
import checkAuth from '../middleware/checkAuth.js';
const router = Router()


router
    .route('/')
    .get(checkAuth,pedidosController.listarPedidos)

router
    .route('/save')
    .post(checkAuth,pedidosController.guardarPedido)

router
    .route('/delete/:id')
    .delete(checkAuth,pedidosController.eliminarPedido)

export default router;