import jwt from 'jsonwebtoken';
import config from '../utils/config'; 
import Usuario from '../models/user'; 

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
    }

    const decoded = jwt.verify(token, config.SECRET);

    const user = await Usuario.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Acceso no autorizado. Usuario no encontrado.' });
    }    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    return res.status(401).json({ message: 'Acceso no autorizado. Token inválido.' });
  }
};

export default authMiddleware;
