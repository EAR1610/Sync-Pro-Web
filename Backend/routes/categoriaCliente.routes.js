import { Router } from 'express'
import categoriaClienteController from '../controllers/categoriaClienteController'
import checkAuth from '../middleware/checkAuth';

const router = Router()

router
    .route('/')
    .get(checkAuth,categoriaClienteController.getCustomerCategory)

router
    .route('/save')
    .post(checkAuth,categoriaClienteController.saveCustomerCategory)

export default router;