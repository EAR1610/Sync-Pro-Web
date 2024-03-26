import sequelize from "../config/config";
import Vendedores from "../models/vendedores";

const vendedorController = {
    // Listar Vendedores
    getVendedores: async (req, res) => {
        try {
            const result = await sequelize.query("select id as value, nombre from Vendedores",
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
    // Listar Vendedores
    listarVendedores: async (req, res) => {
        try {
            const result = await Vendedores.findAll();
            if (result.length === 0)
                return res.status(404).json({ message: 'No se encontraron Vendedores.' }
                );
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    //Guardar un nuevo vendedor
    guardarVendedor: async (req, res) => {

        try {
            const nuevoVendedor = req.body;
            const vendedorGuardado = await Vendedores.create(nuevoVendedor);
            //mensaje de exito
            if (vendedorGuardado)
                return res.status(200).json({
                    message: 'Vendedor guardado correctamente.'
                });

            res.status(200).json(vendedorGuardado);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor. ' + error })
        }
    },

    //Eliminar un vendedor
    eliminarVendedor: async (req, res) => {
        try {
            const { id } = req.params;
            //no eliminamos solo pasamos el campo anulado a true
            const vendedorEliminado = await Vendedores.update({ Anulado: true }, {
                where: { id }
            });
            if (vendedorEliminado)
                return res.status(200).json({ message: 'Vendedor eliminado correctamente.' }
                );
            res.status(404).json({ message: 'Vendedor no encontrado.' });
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    // Buscar vendedor por ID
    getVendedorById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await Vendedores.findByPk(id);
            if (result) {
                return res.status(200).json(result);
            };
            res.status(404).json({ message: 'Vendedor no encontrado.' })
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}

export default vendedorController;