import sequelize from "../config/config";
import Localidad from "../models/localidad";

const localidadController = {

    // Listar Localidades
    getLocations: async (req, res) => {
        try {
            const result = await Localidad.findAll();
            if (result.length === 0)
                return res.status(404).json({ message: 'No se encontraron localidades.' }
                );
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    // Guardar una nueva localidad
    saveLocation: async (req, res) => {
        try {
            const newLocation = req.body;
            const savedLocation = await Localidad.create(newLocation);
            if (savedLocation)
                return res.status(200).json({
                    message: 'Localidad guardada correctamente.'
                });
            res.status(200).json(savedLocation);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.', error })
        }
    }
}

export default localidadController;