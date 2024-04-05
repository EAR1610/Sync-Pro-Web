import clientes from '../models/clientes';

const clientesController = {

    // Listar Clientes 
    getCustomers: async (req, res) => {
        try {
            const result = await clientes.findAll();
            if (result.length === 0) {
                return res.status(404).json({ message: 'No se encontraron clientes.' });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    // Guardar un nuevo cliente
    saveCustomer: async (req, res) => {
        try {
            const newCustomer = req.body;

            if (!newCustomer || Object.keys(newCustomer).length === 0) {
                return res.status(400).json({ message: 'Los datos del cliente son inválidos.' });
            }
            const savedCustomer = await clientes.create(newCustomer);
            if (savedCustomer) {
                return res.status(200).json({
                    message: 'Cliente guardado correctamente.',
                    customer: savedCustomer // Devolver los datos del cliente guardado
                });
            } else {
                return res.status(500).json({ message: 'No se pudo guardar el cliente.' });
            }
        } catch (error) {
            console.error('Error al guardar el cliente:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Buscar por id
    getCustomerById: async (req, res) => {
        try {
            const { id } = req.params;

            // Validar que el ID sea un número entero válido
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'El ID del cliente es inválido.' });
            }
            const customer = await clientes.findByPk(id);
            if (!customer) {
                return res.status(404).json({ message: 'Cliente no encontrado.' });
            }
            return res.status(200).json(customer);
        } catch (error) {
            console.error('Error al buscar el cliente por ID:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    }
}

export default clientesController;