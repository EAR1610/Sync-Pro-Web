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
            const result = await Vendedores.findAll({
                where: {
                    Inhabilitado: 0
                }
            });
            if (result.length === 0)
                return res.status(404).json({ message: 'No se encontraron Vendedores.' });
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

    // Eliminar/ocultar un vendedor
    deleteSeller: async (req, res) => {
        try {
            const { id } = req.params;
            // Cambiar el campo Inhabilitado a true
            const deletedSeller = await Vendedores.update({ Inhabilitado: true }, {
                where: { id }
            });
            if (deletedSeller)
                return res.status(200).json({ message: 'Vendedor ocultado correctamente.' }
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
    },

    // Actualizar un vendedor
    updateSeller: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const [updated] = await Vendedores.update(updatedData, {
                where: { id }
            });
            if (updated) {
                const updatedSeller = await Vendedores.findOne({ where: { id } });
                return res.status(200).json({ message: 'Vendedor actualizado correctamente.', seller: updatedSeller });
            }
            throw new Error('Vendedor no encontrado.');
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}

export default vendedorController;