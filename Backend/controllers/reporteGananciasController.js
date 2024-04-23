import sequelize from "../config/config";

const reporteGananciasController = {

    // Listar reporte de ganancias por procedimiento almacenado
    getProfitReportByProcedure: async (req, res) => {
        try {
            const { fechaDesde, fechaHasta, codMoneda, bodegaId, vendedorId, rdTipo, contadorCredit } = req.body;
            const result = await sequelize.query(
                "EXEC [dbo].[RptGananciaFiltroDetallado] @FechaDesde=:fechaDesde, @FechaHasta=:fechaHasta, @CodMoneda=:codMoneda, @BodegaId=:bodegaId, @VendedorId=:vendedorId, @rdTipo=:rdTipo, @contadoCredit=:contadorCredit",
                {
                    replacements: {
                        fechaDesde,
                        fechaHasta,
                        codMoneda,
                        bodegaId,
                        vendedorId,
                        rdTipo,
                        contadorCredit
                    },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'Reporte de Ganancias no encontrado.' });
            }
        } catch (error) {
            console.error('Error al ejecutar el procedimiento almacenado:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    },
}


export default reporteGananciasController;