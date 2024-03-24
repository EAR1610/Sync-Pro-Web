import sequelize from "../config/config";

const empresaController = {

    //Lista la información de la empresa
    getEmpresa : async (req, res) => {
        try {
            const result = await sequelize.query("SELECT Empresa.Id, Empresa.Cedula, Empresa.Empresa, Empresa.NombreComercial FROM Empresa;",
                {
                    type: sequelize.QueryTypes.SELECT,
                }            
            )
            res.status(200).json(result);
        } catch (error) {
            console.log('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },
    getImagenEmpresa: async (req, res) => {
        try {
            const result = await sequelize.query("SELECT Empresa.Imagen FROM Empresa;",
                {
                    type: sequelize.QueryTypes.SELECT,
                }            
            )
            console.log(result[0]);
            res.status(200).json(result[0]);
        } catch (error) {
            console.log('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}

export default empresaController;