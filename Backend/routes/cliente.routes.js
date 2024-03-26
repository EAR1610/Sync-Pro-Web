import { Router } from 'express'
import clientesController from '../controllers/clientesController'
import checkAuth from '../middleware/checkAuth.js';

const router = Router()

router
    .route('/listarClientes')
    .get(checkAuth,clientesController.listarClientes)

router
    .route('/guardarCliente')
    .post(checkAuth,clientesController.guardarCliente)

router
    .route('/buscarClientePorId/:id')
    .get(checkAuth,clientesController.buscarClientePorId)

export default router;