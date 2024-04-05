import { Router } from 'express'
import clientesController from '../controllers/clientesController'
import checkAuth from '../middleware/checkAuth.js';

const router = Router()

router
    .route('/')
    .get(checkAuth,clientesController.getCustomers)

router
    .route('/save')
    .post(checkAuth,clientesController.saveCustomer)

router
    .route('/id/:id')
    .get(checkAuth,clientesController.getCustomerById)

export default router;