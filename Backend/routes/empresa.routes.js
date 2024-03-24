import { Router } from "express";
import empresaController from "../controllers/empresaController";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router
    .route('/')
    .get(checkAuth, empresaController.getEmpresa);

router
    .route('/imagen')
    .get(checkAuth, empresaController.getImagenEmpresa);

export default router;