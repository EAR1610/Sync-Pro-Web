import { Router } from 'express';
import cajaController from '../controllers/cajaController';
import checkAuth from '../middleware/checkAuth';

const router = Router();

router
    .route('/cierre')
    .post(checkAuth, cajaController.getCierreByNumApertura);

router
    .route("/cierre/personalizado")
    .get(checkAuth, cajaController.getCierrePersonalizado);

router
    .route("/cierre/:nCierre")
    .get(checkAuth, cajaController.getCierreByNumCierre);

router
    .route("/estado")
    .get(checkAuth, cajaController.getEstadosByEstado);

router
    .route("/corte")
    .post(checkAuth, cajaController.getCorteByNumApertura);
    
export default router;