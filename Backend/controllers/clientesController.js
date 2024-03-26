import clientes from '../models/clientes';

const clientesController = {
    listarClientes: async (req, res) => {
        try {
            const result = await clientes.findAll();
            res.status(200).json(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    //Guardar un nuevo cliente
    guardarCliente: async (req, res) => {

        try {
            const nuevoCliente = req.body;
            const clienteGuardado = await clientes.create(nuevoCliente);
            res.status(200).json(clienteGuardado);
        }catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.', error })
        }
    },

    //Buscar por id
    buscarClientePorId: async (req, res) => {
        try {
            const { id } = req.params;
            const cliente = await clientes.findByPk(id);
            res.status(200).json(cliente);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.', error })
        }
    }
}

export default clientesController;