import sequelize from "../config/config";

const inventarioController = {

    // Listar inventario personalizado
    getInventory: async (req, res) => {
        try {
            const result = await sequelize.query(`
            SELECT 
                Inventario.codigo, 
                Barras, 
                Descripcion, 
                COSTOGENERAL As Costo, 
                PRECIOA as PrecioFinal, 
                PRECIOB, 
                PRECIOC, 
                PRECIOD, 
                MARCAS.NOMBREMARCA As Marcas, 
                CONCAT(Categorias.categoria, ' / ', SubCategorias.SubCategoria) AS Categoria_SubCategoria 
            FROM 
                INVENTARIO 
            INNER JOIN 
                MARCAS ON INVENTARIO.CODMARCA = MARCAS.ID 
            INNER JOIN 
                ArticuloBodega ON ArticuloBodega.CodArticulo = Inventario.Codigo 
            INNER JOIN 
                SubCategorias ON SubCategorias.Id = Inventario.CodSubCategoria 
            INNER JOIN 
                Categorias ON Categorias.Codigo = SubCategorias.CodCategoria;
        `, {
                type: sequelize.QueryTypes.SELECT,
            });

            res.status(200).json(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    // Listar inventario personalizado por código de barras
    getInventoryByBarcode: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'El código de barras es inválido.' });
            }

            const result = await sequelize.query(`
            SELECT 
                Inventario.codigo, 
                Barras, 
                Descripcion, 
                COSTOGENERAL As Costo, 
                PRECIOA as PrecioFinal, 
                PRECIOB, 
                PRECIOC, 
                PRECIOD, 
                MARCAS.NOMBREMARCA As Marcas, 
                CONCAT(Categorias.categoria, ' / ', SubCategorias.SubCategoria) AS Categoria_SubCategoria 
            FROM 
                INVENTARIO 
            INNER JOIN 
                MARCAS ON INVENTARIO.CODMARCA = MARCAS.ID 
            INNER JOIN 
                ArticuloBodega ON ArticuloBodega.CodArticulo = Inventario.Codigo 
            INNER JOIN 
                SubCategorias ON SubCategorias.Id = Inventario.CodSubCategoria 
            INNER JOIN 
                Categorias ON Categorias.Codigo = SubCategorias.CodCategoria 
            WHERE 
                Barras = :id;
        `, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (result && result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: 'No se encontró ningún artículo con el código de barras proporcionado.' });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    },

    // Listar inventario personalizado
    getCustomInventory: async (req, res) => {
        try {
            const result = await sequelize.query(`
            SELECT 
                Inventario.codigo, 
                Barras, 
                Descripcion, 
                ExistenciaBodegas.ExistenciaTotal AS Existencia, 
                COSTOGENERAL As Costo, 
                PRECIOA as PrecioFinal, 
                PRECIOB, 
                PRECIOC, 
                PRECIOD, 
                MARCAS.NOMBREMARCA As Marcas, 
                CONCAT(Categorias.categoria, ' / ', SubCategorias.SubCategoria) AS Categoria_SubCategoria,
                Observaciones 
            FROM 
                INVENTARIO 
            INNER JOIN 
                EXISTENCIABODEGAS ON INVENTARIO.CODIGO=EXISTENCIABODEGAS.CODARTICULO 
            INNER JOIN 
                MARCAS ON INVENTARIO.CODMARCA = MARCAS.ID 
            INNER JOIN 
                SubCategorias ON SubCategorias.Id = Inventario.CodSubCategoria 
            INNER JOIN 
                Categorias ON Categorias.Codigo = SubCategorias.CodCategoria;
        `, {
                type: sequelize.QueryTypes.SELECT,
            });

            res.status(200).json(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    // Listar inventario personalizado por código de barras
    getCustomInventoryByBarcode: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'El código de barras es inválido.' });
            }

            const result = await sequelize.query(`
            SELECT 
                Inventario.codigo, 
                Barras, 
                Descripcion, 
                Inventario.Existencia, 
                COSTOGENERAL As Costo, 
                PRECIOA as PrecioFinal, 
                PRECIOB, 
                PRECIOC, 
                PRECIOD, 
                MARCAS.NOMBREMARCA As Marcas, 
                CONCAT(Categorias.categoria, ' / ', SubCategorias.SubCategoria) AS Categoria_SubCategoria, 
                ImagenByte, 
                Observaciones 
            FROM 
                INVENTARIO 
            INNER JOIN 
                MARCAS ON INVENTARIO.CODMARCA = MARCAS.ID 
            INNER JOIN 
                ArticuloBodega ON ArticuloBodega.CodArticulo = Inventario.Codigo 
            INNER JOIN 
                SubCategorias ON SubCategorias.Id = Inventario.CodSubCategoria 
            INNER JOIN 
                Categorias ON Categorias.Codigo = SubCategorias.CodCategoria 
            WHERE 
                Barras = :id;
        `, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (result && result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: 'No se encontró ningún artículo con el código de barras proporcionado.' });
            }
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', error });
        }
    }
}

export default inventarioController;