import sequelize from "../config/config";
import CategoriaClientes from "../models/categoriaCliente";

const categoriaClienteController = {

    // Listar Categorias de Clientes
    getCustomerCategory: async (req, res) => {
        try {
            const result = await CategoriaClientes.findAll();
            if (result.length === 0)
                return res.status(404).json({ message: 'No se encontraron clientes.' }
                );
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    // Guardar una nueva categoria de cliente
    saveCustomerCategory: async (req, res) => {
        try {
            const newCustomerCategory = req.body;
            const savedCustomerCategory = await CategoriaClientes.create(newCustomerCategory);
            if (savedCustomerCategory)
                return res.status(200).json({
                    message: 'Categoria de cliente guardada correctamente.'
                });
            res.status(200).json(savedCustomerCategory);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.', error })
        }
    }
}

export default categoriaClienteController;