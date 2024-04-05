import detallePedidos from '../models/detallePedidos.js';
import sequelize from "../config/config";

const detallePedidosController = {

    // Obtener detalles de todos los pedidos
    getOrderDetails: async (req, res) => {
        try {
            const orderDetails = await detallePedidos.findAll();
            if (orderDetails.length === 0) {
                return res.status(404).json({ message: 'No se encontraron detalles de pedidos.' });
            }
            return res.status(200).json(orderDetails);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Guardar un nuevo detalle de pedido
    saveOrderDetails: async (req, res) => {
        try {
            const newOrderDetail = req.body;

            if (!newOrderDetail || Object.keys(newOrderDetail).length === 0) {
                return res.status(400).json({ message: 'Los datos del detalle de pedido son inválidos.' });
            }
            const savedOrderDetail = await detallePedidos.create(newOrderDetail);

            if (savedOrderDetail) {
                return res.status(200).json({
                    message: 'Detalle de pedido guardado correctamente.',
                    orderDetail: savedOrderDetail
                });
            } else {
                return res.status(500).json({ message: 'No se pudo guardar el detalle de pedido.' });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Eliminar un detalle de pedido
    /**
     * TODO: El detalle de pedido no se debería de eliminar, sino que debería de ocultarse.
     */
    deleteOrderDetails: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'El ID del detalle de pedido es inválido.' });
            }
            const deletedRowCount = await detallePedidos.destroy({ where: { id } });

            // Verificar si se eliminó el detalle de pedido correctamente
            if (deletedRowCount > 0) {
                return res.status(200).json({
                    message: 'Detalle de pedido eliminado correctamente.',
                    deletedRowCount: deletedRowCount
                });
            } else {
                return res.status(404).json({ message: 'El detalle de pedido no existe.' });
            }
        } catch (error) {
            console.error('Error al eliminar el detalle de pedido:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Obtener detalles de pedido por ID
    getOrderDetailsById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'El ID del pedido es inválido.' });
            }
            const result = await sequelize.query(
                "SELECT p.id AS Id_pedido, p.fecha AS fecha_pedido, p.fechaEntrega AS fecha_entrega, dp.Descripcion AS Producto, dp.Cantidad AS Unidades, dp.PrecioVenta AS Precio_individual FROM pedidos p INNER JOIN DetallePedisos dp ON dp.idPedido = p.id WHERE p.id = :id;",
                {
                    replacements: { id },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            // Verificar si se encontraron detalles de pedido
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "Detalle de pedido no encontrado." });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    }
}

export default detallePedidosController;