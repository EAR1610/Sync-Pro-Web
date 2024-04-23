import { Router } from "express";
import reporteGananciasController from "../controllers/reporteGananciasController";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router
    .route('/general')
    .post(reporteGananciasController.getProfitReportByProcedure)

export default router;