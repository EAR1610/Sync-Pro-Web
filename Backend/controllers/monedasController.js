import sequelize from "../config/config";
import Monedas from "../models/monedas";

const monedasController = {

    // Listar Monedas
    getCurrency: async (req, res) => {
        try {
            const result = await Monedas.findAll();
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    // Listar Monedas por id
    getCurrencyById: async (req, res) => {
        try {
            const { id } = req.params;
            const currency = await Monedas.findByPk(id);
            if (!currency)
                return res.status(404).json({ message: 'Moneda no encontrada.' }
                );
            res.status(200).json(currency);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}

export default monedasController;