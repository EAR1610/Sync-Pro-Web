// usuarioController.js
import Usuario from '../models/user';
import sequelize  from '../config'; 
const usuarioController = {
  // Obtener todos los usuarios
  getAllUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  // Obtener un usuario por ID
  getUsuarioById: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findByPk(id);
      if (usuario) {
        res.json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener usuario por ID' });
    }
  },

  // Crear un nuevo usuario
  createUsuario: async (req, res) => {
    const { username, password } = req.body;
    try {
      const nuevoUsuario = await Usuario.create({ username, password });
      res.json(nuevoUsuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  // Actualizar un usuario por ID
  updateUsuarioById: async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
      const usuario = await Usuario.findByPk(id);
      if (usuario) {
        await usuario.update({ username, password });
        res.json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar usuario por ID' });
    }
  },

  // Eliminar un usuario por ID
  deleteUsuarioById: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findByPk(id);
      if (usuario) {
        await usuario.destroy();
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar usuario por ID' });
    }
  },

   getAllProducts : async (req, res) => {
    try {
      const { tipo, esAdmin, esProductoCompuesto } = req.body;
  
      const result = await sequelize.query('EXEC cargarFormulario :tipo, :esAdmin, :esProductoCompuesto', {
        replacements: {
          tipo,
          esAdmin,
          esProductoCompuesto,
        },
        type: sequelize.QueryTypes.SELECT,
      });
  
      res.status(200).json(result);
    } catch (error) {

    
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
};

export default usuarioController;
