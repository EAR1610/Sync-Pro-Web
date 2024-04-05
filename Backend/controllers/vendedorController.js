import sequelize from "../config/config";
import Vendedores from "../models/vendedores";

const vendedorController = {

    // Listar Vendedores con id (value) y nombre
    getIdAndNameSellers: async (req, res) => {
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

    // Listar Vendedores con todos los campos
    getSellers: async (req, res) => {
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
    saveSeller: async (req, res) => {
        try {
            const newSeller = req.body;
            const savedSeller = await Vendedores.create(newSeller);
            if (savedSeller)
                return res.status(200).json({
                    message: 'Vendedor guardado correctamente.'
                });
            res.status(200).json(savedSeller);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor. ' + error })
        }
    },

    //Eliminar un vendedor
    /**
     *  ! No existe el campo Anulado en la tabla Vendedores
     *  TODO: Crear campo Anulado en la tabla Vendedores
     */
    deleteSeller: async (req, res) => {
        try {
            const { id } = req.params;
            // Cambiar el campo Anulado a true
            const deletedSeller = await Vendedores.update({ Anulado: true }, {
                where: { id }
            });
            if (deletedSeller)
                return res.status(200).json({ message: 'Vendedor eliminado correctamente.' }
                );
            res.status(404).json({ message: 'Vendedor no encontrado.' });
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    // Buscar vendedor por ID  getVendedorById
    getSellerById: async (req, res) => {
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