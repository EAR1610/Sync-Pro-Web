import { Router } from 'express';
import cajaController from '../controllers/cajaController';
import checkAuth from '../middleware/checkAuth';

const router = Router();

router
    .route('/cierre')
    .post(checkAuth, cajaController.getClosureByOpeningNumber);

router
    .route("/cierre/personalizado")
    .get(checkAuth, cajaController.getCustomClosure);

router
    .route("/cierre/:nCierre")
    .get(checkAuth, cajaController.getClosureByClosureNumber);

router
    .route("/estado")
    .get(checkAuth, cajaController.getStatesByState);

router
    .route("/corte")
    .post(checkAuth, cajaController.getCutByOpeningNumber);
    
export default router;