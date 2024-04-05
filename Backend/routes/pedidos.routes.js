import {Router} from 'express'
import pedidosController from '../controllers/pedidosController.js'
import checkAuth from '../middleware/checkAuth.js';
const router = Router()


router
    .route('/')
    .get(checkAuth,pedidosController.getOrders)

router
    .route('/save')
    .post(checkAuth,pedidosController.saveOrder)

router
    .route('/delete/:id')
    .post(checkAuth,pedidosController.deleteOrder)

router
    .route('/list/custom')
    .get(checkAuth,pedidosController.getCustomOrder)

router
    .route('/list/seller/:id')
    .get(checkAuth,pedidosController.getOrderByIdSeller)

export default router;