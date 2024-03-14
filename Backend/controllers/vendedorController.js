import sequelize from "../config/config";

const vendedorController = {
    // Listar vendedores
    getVendedores: async (req, res) => {
        try {
            const result = await sequelize.query("select id as value, nombre from vendedores",
                {
                    type: sequelize.QueryTypes.SELECT,
                });
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Vendedores no encontrados." });
            }            
        } catch (error) {
            console.log("Error al ejecutar la consulta: ", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    },
}

export default vendedorController;