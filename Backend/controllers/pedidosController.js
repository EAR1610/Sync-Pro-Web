import pedidos from '../models/pedidos.js';

const pedidosController = {
    listarPedidos: async (req, res) => {
        try {
            const result = await pedidos.findAll();
            if(result.length === 0) 
               return res.status(404).json({ message: 'No se encontraron pedidos.' }
            );
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    //Guardar un nuevo pedido
    guardarPedido: async (req, res) => {

        try {
            const nuevoPedido = req.body;
            const pedidoGuardado = await pedidos.create(nuevoPedido);
            //mensaje de exito
            if(pedidoGuardado) 
               return res.status(200).json({ message: 'Pedido guardado correctamente.' , pedidoGuardado
            });

            res.status(200).json(pedidoGuardado);
        }catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor. ' + error})
        }
    },

    //Eliminar un pedido
    eliminarPedido: async (req, res) => {
        try {
            const { id } = req.params;
            //no eliminamos solo pasamos el campo anulado a true
            const pedidoEliminado = await pedidos.update({ Anulado: true }, {
                where: { id }
            });
            if (pedidoEliminado) 
               return res.status(200).json({ message: 'Pedido eliminado correctamente.' }
            );
            res.status(404).json({ message: 'Pedido no encontrado.' });
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}

export default pedidosController;