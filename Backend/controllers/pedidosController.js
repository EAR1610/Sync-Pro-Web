import sequelize from '../config/config.js';
import pedidos from '../models/pedidos.js';

const pedidosController = {

    // Listar todos los pedidos
    getOrders: async (req, res) => {
        try {
            const orders = await pedidos.findAll();
            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: 'No se encontraron pedidos.' });
            }
            return res.status(200).json(orders);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Guardar un nuevo pedido
    saveOrder: async (req, res) => {
        try {
            const newOrder = req.body;
            if (!newOrder || Object.keys(newOrder).length === 0) {
                return res.status(400).json({ message: 'Los datos del pedido son inválidos.' });
            }
            const savedOrder = await pedidos.create(newOrder);
            if (savedOrder) {
                return res.status(200).json({
                    message: 'Pedido guardado correctamente.',
                    savedOrder: savedOrder
                });
            } else {
                return res.status(500).json({ message: 'No se pudo guardar el pedido.' });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor. ' + error });
        }
    },

    // Eliminar un pedido (marcar como anulado)
    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'El ID del pedido es inválido.' });
            }
            const [orderUpdatedCount] = await pedidos.update({ Anulado: true }, {
                where: { id }
            });
            if (orderUpdatedCount > 0) {
                return res.status(200).json({ message: 'Pedido anulado correctamente.' });
            } else {
                return res.status(404).json({ message: 'Pedido no encontrado.' });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Listar pedido personalizado
    getCustomOrder: async (req, res) => {
        try {
            const result = await sequelize.query(`
            SELECT
                p.id AS Id_pedido,
                v.id AS Id_vendedor,
                v.Nombre AS Vendedor,
                FORMAT(p.fecha, 'dd-MM-yyyy') AS fecha_pedido,
                FORMAT(p.fechaEntrega, 'dd-MM-yyyy') AS fecha_entrega,
                p.Observaciones,
                p.CodCliente AS Id_cliente,
                c.Nombre AS Cliente,
                CAST(SUM(CAST(dt.PrecioVenta AS DECIMAL(10,2)) * CAST(dt.Cantidad AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS Total
            FROM
                pedidos p
            INNER JOIN
                clientes c ON c.CodCliente = p.CodCliente
            INNER JOIN
                Vendedores v ON v.Id = p.idVendedor
            INNER JOIN
                DetallePedisos dt ON dt.IdPedido = p.id
            GROUP BY
                p.id, v.id, v.Nombre, p.fecha, p.fechaEntrega, p.Observaciones, p.CodCliente, c.Nombre;
        `, {
                type: sequelize.QueryTypes.SELECT
            });

            if (result && result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: 'No se encontraron pedidos.' });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Obtener pedidos por ID de vendedor
    getOrderByIdSeller: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'El ID del vendedor es inválido.' });
            }

            const order = await sequelize.query(`
            SELECT
                p.id AS Id_pedido,
                v.id AS Id_vendedor,
                v.Nombre AS Vendedor,
                FORMAT(p.fecha, 'dd-MM-yyyy') AS fecha_pedido,
                FORMAT(p.fechaEntrega, 'dd-MM-yyyy') AS fecha_entrega,
                p.Observaciones,
                p.CodCliente AS Id_cliente,
                c.Nombre AS Cliente,
                CAST(SUM(CAST(dt.PrecioVenta AS DECIMAL(10,2)) * CAST(dt.Cantidad AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS Total
            FROM
                pedidos p
            INNER JOIN
                clientes c ON c.CodCliente = p.CodCliente
            INNER JOIN
                Vendedores v ON v.Id = p.idVendedor
            INNER JOIN
                DetallePedisos dt ON dt.IdPedido = p.id
            WHERE
                v.id = :id
            GROUP BY
                p.id, v.id, v.Nombre, p.fecha, p.fechaEntrega, p.Observaciones, p.CodCliente, c.Nombre;
        `, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            });

            // Verificar si se encontraron pedidos para el vendedor
            if (order && order.length > 0) {
                return res.status(200).json(order);
            } else {
                return res.status(404).json({ message: 'No se encontraron pedidos para este vendedor.' });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },
}

export default pedidosController;