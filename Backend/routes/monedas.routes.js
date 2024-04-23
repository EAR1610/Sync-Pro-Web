import {Router} from 'express'
import monedasController from '../controllers/monedasController.js'
import checkAuth from '../middleware/checkAuth';

const router = Router()

router
    .route("/")
    .get(checkAuth,monedasController.getCurrency)

router
    .route('/:id')
    .get(checkAuth,monedasController.getCurrencyById)

export default router;