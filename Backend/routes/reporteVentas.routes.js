import { Router } from "express";
import reporteVentasController from "../controllers/reporteVentasController";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router
    .route('/general')
    .post(reporteVentasController.getSalesReportByProcedure);

export default router;