import sequelize from "../config/config";

const cajaController = {

    // Listar cierre de caja por número de apertura
    getCierreByNumApertura: async (req, res) => {
        try {
            const { nApertura } = req.body;
            const result = await sequelize.query("exec [dbo].[ObtenerCierreCaja] @NApertura = :nApertura",
                {
                    replacements: { nApertura },
                    type: sequelize.QueryTypes.SELECT
                });

            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Cierre de caja no encontrado." });
            }
        } catch (error) {
            console.log("Error al ejecutar el procedimiento almacenado:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    },

    getCorteByNumApertura: async (req, res) => {
        try {
            const { nApertura } = req.body;
            const result = await sequelize.query("exec [dbo].[ObtenerCorte] @NApertura = :nApertura",
                {
                    replacements: { nApertura },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Corte de caja no encontrado." });
            }
        } catch (error) {
            console.log("Error al ejecutar el procedimiento almacenado:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    },
        // Listar cierre de caja (Cierre, nombre, fecha)
        getCierrePersonalizado: async (req, res) => {
            try {
                const result = await sequelize.query("SELECT CierreCaja.idApertura, CAST(dbo.CierreCaja.NumeroCierre AS varchar) AS Cierre, dbo.Usuario.Nombre, dbo.AperturaCaja.Fecha, CierreCaja.Anulado FROM  dbo.CierreCaja INNER JOIN dbo.AperturaCaja ON dbo.CierreCaja.IdApertura = dbo.AperturaCaja.NApertura INNER JOIN dbo.Usuario ON dbo.AperturaCaja.IdUsuario = dbo.Usuario.Id ORDER BY CierreCaja.NumeroCierre DESC;",
                    {
                        type: sequelize.QueryTypes.SELECT
                    }
                );
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "No se encontraron cierres de caja." })
                }
            } catch (error) {
                console.log("Error al ejecutar la consulta.", error);
                res.status(500).json({ error: "Error interno del servidor." });
            }
        },

        // Listar cierre de caja por número de cierre
        getCierreByNumCierre: async (req, res) => {
            try {
                const { nCierre } = req.params;
                const result = await sequelize.query("SELECT IdApertura, Fecha, IdUsuario, Anulado FROM CierreCaja WHERE NumeroCierre = :nCierre",
                    {
                        replacements: { nCierre },
                        type: sequelize.QueryTypes.SELECT
                    });
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "Cierre de caja no encontrado." });
                }
            } catch (error) {
                console.log("Error al ejecutar el procedimiento almacenado:", error);
                res.status(500).json({ error: "Error interno del servidor." });
            }
        },

        // Listar estado de caja por estado
        getEstadosByEstado: async (req, res) => {
            try {                
                const result = await sequelize.query("Select NApertura,Cajero from vEstadoCaja where anulado=0 and Estado = 'A'",
                    {                        
                        type: sequelize.QueryTypes.SELECT
                    }
                );
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "Estado de caja no encontrado." });
                }
            } catch (error) {
                console.log("Error al ejecutar la consulta:", error);
                res.status(500).json({ error: "Error interno del servidor." });
            }
        }
}

export default cajaController;