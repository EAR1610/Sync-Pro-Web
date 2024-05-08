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

router
    .route('/update/:id')
    .put(checkAuth,clientesController.updateCustomer)

router
    .route('/balances')
    .get(checkAuth,clientesController.getCustomerBalances)

router
    .route('/hide/:CodCliente')
    .put(checkAuth,clientesController.deleteCustomer)

router
    .route('/recover/:CodCliente')
    .put(checkAuth,clientesController.recoverCustomer)

router
    .route('/inactive')
    .get(checkAuth,clientesController.getInactiveCustomers)
    
export default router;