import sequelize from "../config/config";

const inventarioController = {

    // Listar inventario personalizado
    getInventario: async (req, res) => {
        try {
            const result = await sequelize.query("SELECT Inventario.codigo, Barras, Descripcion, COSTOGENERAL As Costo, PRECIOA as PrecioFinal, PRECIOB, PRECIOC, PRECIOD, MARCAS.NOMBREMARCA As Marcas, Categorias.categoria + ' / ' + SubCategorias.SubCategoria As Categoria_SubCategoria FROM INVENTARIO INNER JOIN MARCAS ON INVENTARIO.CODMARCA = MARCAS.ID INNER JOIN ArticuloBodega ON ArticuloBodega.CodArticulo = Inventario.Codigo INNER JOIN SubCategorias ON SubCategorias.Id = Inventario.CodSubCategoria INNER JOIN Categorias ON Categorias.Codigo = SubCategorias.CodCategoria",
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            )
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' })
        }
    },

    getInventarioByBarras: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await sequelize.query("SELECT Inventario.codigo, Barras, Descripcion, COSTOGENERAL As Costo, PRECIOA as PrecioFinal, PRECIOB, PRECIOC, PRECIOD, MARCAS.NOMBREMARCA As Marcas, Categorias.categoria + ' / ' + SubCategorias.SubCategoria As Categoria_SubCategoria FROM INVENTARIO INNER JOIN MARCAS ON INVENTARIO.CODMARCA = MARCAS.ID INNER JOIN ArticuloBodega ON ArticuloBodega.CodArticulo = Inventario.Codigo INNER JOIN SubCategorias ON SubCategorias.Id = Inventario.CodSubCategoria INNER JOIN Categorias ON Categorias.Codigo = SubCategorias.CodCategoria where Barras = " + id,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            )
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    getInventarioPersonalizado: async (req, res) => {
        try {
            const result = await sequelize.query("SELECT Inventario.codigo, Barras, Descripcion, ExistenciaBodegas.ExistenciaTotal AS Existencia, COSTOGENERAL As Costo, PRECIOA as PrecioFinal, PRECIOB, PRECIOC, PRECIOD, MARCAS.NOMBREMARCA As Marcas, Categorias.categoria + ' / ' + SubCategorias.SubCategoria As " +
            "Categoria_SubCategoria, Observaciones FROM INVENTARIO INNER JOIN EXISTENCIABODEGAS ON INVENTARIO.CODIGO=EXISTENCIABODEGAS.CODARTICULO " +
            "INNER JOIN MARCAS ON INVENTARIO.CODMARCA = MARCAS.ID INNER JOIN SubCategorias ON SubCategorias.Id = Inventario.CodSubCategoria INNER JOIN Categorias ON Categorias.Codigo = SubCategorias.CodCategoria",
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            )
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    getInventarioPersonalizadoByBarras: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await sequelize.query("SELECT Inventario.codigo, Barras, Descripcion, Inventario.Existencia, COSTOGENERAL As Costo, PRECIOA as PrecioFinal, PRECIOB, PRECIOC, PRECIOD, MARCAS.NOMBREMARCA As Marcas, Categorias.categoria + ' / ' + SubCategorias.SubCategoria As Categoria_SubCategoria, ImagenByte, Observaciones FROM INVENTARIO INNER JOIN MARCAS ON INVENTARIO.CODMARCA = MARCAS.ID INNER JOIN ArticuloBodega ON ArticuloBodega.CodArticulo = Inventario.Codigo INNER JOIN SubCategorias ON SubCategorias.Id = Inventario.CodSubCategoria INNER JOIN Categorias ON Categorias.Codigo = SubCategorias.CodCategoria where Barras = :id",
                {
                    replacements: { id },
                    type: sequelize.QueryTypes.SELECT,
                }
            )
            res.status(200).json(result)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },
}

export default inventarioController;