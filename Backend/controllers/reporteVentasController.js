import sequelize from "../config/config.js";

const reporteVentasController = {

    // Listar reporte de ventas
    getReporteVentasByProcedure: async (req, res) => {
        try {
            const { fechaDesde, fechaHasta, codMoneda, rdTipo, vendedorId, bodegaId, contadorCredit } = req.body;                             
            const result = await sequelize.query(
                "EXEC [rptVentasGeneralesFiltro] @FechaDesde=:fechaDesde, @FechaHasta=:fechaHasta, @CodMoneda=:codMoneda, @rdTipo=:rdTipo, @VendedorId=:vendedorId, @BodegaId=:bodegaId, @contadoCredit=:contadorCredit",
                {
                    replacements: {
                        fechaDesde,
                        fechaHasta,
                        codMoneda,
                        rdTipo,
                        vendedorId,
                        bodegaId,
                        contadorCredit
                    },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            console.log(result);
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'Reporte de Ventas no encontrado.' });
            }
        } catch (error) {
            console.error('Error al ejecutar el procedimiento almacenado:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    },
}

export default reporteVentasController;