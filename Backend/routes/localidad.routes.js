import {Router} from 'express'
import localidadController from '../controllers/localidadController.js'
import checkAuth from '../middleware/checkAuth';

const router = Router()

router
    .route('/')
    .get(checkAuth,localidadController.getLocations)

router
    .route('/save')
    .post(checkAuth,localidadController.saveLocation)


export default router;  
