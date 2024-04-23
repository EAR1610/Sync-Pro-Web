import clientes from '../models/clientes';
import sequelize from "../config/config";

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
    },

    // Actualizar cliente
    updateCustomer: async (req, res) => {
        try {
            const { id } = req.params;
            const customerData = req.body;

            // Validar que el ID sea un número entero válido
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'El ID del cliente es inválido.' });
            }
            const customer = await clientes.findByPk(id);
            if (!customer) {
                return res.status(404).json({ message: 'Cliente no encontrado.' });
            }
            const updatedCustomer = await customer.update(customerData);
            return res.status(200).json({
                message: 'Cliente actualizado correctamente.',
                customer: updatedCustomer // Devolver los datos del cliente actualizado
            });
        } catch (error) {
            console.error('Error al actualizar el cliente:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Listar Saldos de Clientes
    getCustomerBalances: async (req, res) => {
        try {
            const result = await sequelize.query(`
                SELECT 
                    Clientes.CodCliente,
                    Clientes.Cedula,
                    Clientes.Celular,
                    Clientes.Credito,
                    Clientes.Nombre,
                    Clientes.Telefono1,
                    Clientes.Telefono2,
                    dbo.SaldoCliente(Clientes.CodCliente, dbo.DevolverTC(vConfig.CodMoneda)) AS Saldo,
                    (CASE inhabilitado WHEN 1 THEN 0 ELSE 1 END) AS Habilitado,
                    DPI
                FROM 
                    Clientes 
                CROSS JOIN 
                    vConfig 
                WHERE 
                    (CASE inhabilitado WHEN 1 THEN 0 ELSE 1 END = 1) 
                ORDER BY 
                    Clientes.Nombre`,
                {
                    type: sequelize.QueryTypes.SELECT,
                });

            if (result && result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: 'No se encontraron clientes.' });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },
}

export default clientesController;