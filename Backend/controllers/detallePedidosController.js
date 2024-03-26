import detallePedidos from '../models/detallePedidos.js';

const detallePedidosController = {
    listarDetallePedidos: async (req, res) => {
        try {
            const result = await detallePedidos.findAll();
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    //Guardar un nuevo detalle pedido
    guardarDetallePedido: async (req, res) => {
        try {
            const nuevoDetallePedido = req.body;
            console.log("*Nuevo detalle pedido: *" + nuevoDetallePedido)
            const detallePedidoGuardado = await detallePedidos.create(nuevoDetallePedido);
            console.log("*DETALLE PEDIDO *"+ detallePedidoGuardado)
            //mensaje de exito
            if (detallePedidoGuardado)
                return res.status(200).json({
                    message: 'Pedido guardado correctamente.'
                });
            res.status(200).json(detallePedidoGuardado);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    //Eliminar un detalle pedido
    eliminarDetallePedido: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await detallePedidos.destroy({ where: { id } });
            res.status(200).json(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    }
}

export default detallePedidosController;