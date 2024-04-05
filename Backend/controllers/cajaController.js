import sequelize from "../config/config";

const cajaController = {

    // Listar cierre de caja por número de apertura
    getClosureByOpeningNumber: async (req, res) => {
        try {
            const { nApertura } = req.body;

            if (!nApertura || isNaN(nApertura)) {
                return res.status(400).json({ message: 'El número de apertura es inválido.' });
            }

            const result = await sequelize.query(`
            exec [dbo].[ObtenerCierreCaja] @NApertura = :nApertura;
        `, {
                replacements: { nApertura },
                type: sequelize.QueryTypes.SELECT
            });

            if (result && result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "Cierre de caja no encontrado para el número de apertura proporcionado." });
            }
        } catch (error) {
            console.error("Error al ejecutar el procedimiento almacenado:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    },

    // Listar corte de caja por número de apertura
    getCutByOpeningNumber: async (req, res) => {
        try {
            const { nApertura } = req.body;

            if (!nApertura || isNaN(nApertura)) {
                return res.status(400).json({ message: 'El número de apertura es inválido.' });
            }

            const result = await sequelize.query(`
            exec [dbo].[ObtenerCorte] @NApertura = :nApertura;
        `, {
                replacements: { nApertura },
                type: sequelize.QueryTypes.SELECT
            });

            if (result && result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "Corte de caja no encontrado para el número de apertura proporcionado." });
            }
        } catch (error) {
            console.error("Error al ejecutar el procedimiento almacenado:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    },

    // Listar cierre de caja (Cierre, nombre, fecha)
    getCustomClosure: async (req, res) => {
        try {
            const result = await sequelize.query(`
            SELECT 
                CierreCaja.idApertura, 
                CAST(dbo.CierreCaja.NumeroCierre AS varchar) AS Cierre, 
                dbo.Usuario.Nombre, 
                dbo.AperturaCaja.Fecha, 
                CierreCaja.Anulado 
            FROM  
                dbo.CierreCaja 
            INNER JOIN 
                dbo.AperturaCaja ON dbo.CierreCaja.IdApertura = dbo.AperturaCaja.NApertura 
            INNER JOIN 
                dbo.Usuario ON dbo.AperturaCaja.IdUsuario = dbo.Usuario.Id 
            ORDER BY 
                dbo.CierreCaja.NumeroCierre DESC;
        `, {
                type: sequelize.QueryTypes.SELECT
            });

            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "No se encontraron cierres de caja." });
            }
        } catch (error) {
            console.error("Error al ejecutar la consulta:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    },

    // Listar cierre de caja por número de cierre
    getClosureByClosureNumber: async (req, res) => {
        try {
            const { nCierre } = req.params;

            if (!nCierre || isNaN(nCierre)) {
                return res.status(400).json({ message: 'El número de cierre es inválido.' });
            }

            const result = await sequelize.query(`
            SELECT 
                IdApertura, 
                Fecha, 
                IdUsuario, 
                Anulado 
            FROM 
                CierreCaja 
            WHERE 
                NumeroCierre = :nCierre;
        `, {
                replacements: { nCierre },
                type: sequelize.QueryTypes.SELECT
            });

            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "Cierre de caja no encontrado para el número de cierre proporcionado." });
            }
        } catch (error) {
            console.error("Error al ejecutar el procedimiento almacenado:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    },

    // Listar estado de caja por estado
    /**
     * TODO: Comprobar si la consulta es correcta y si devuelve los datos esperados.
     */
    getStatesByState: async (req, res) => {
        try {
            const result = await sequelize.query(`
            SELECT 
                NApertura,
                Cajero
            FROM 
                vEstadoCaja 
            WHERE 
                anulado = 0 AND
                Estado = 'A';
        `, {
                type: sequelize.QueryTypes.SELECT
            });

            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "Estado de caja no encontrado." });
            }
        } catch (error) {
            console.error("Error al ejecutar la consulta:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

export default cajaController;