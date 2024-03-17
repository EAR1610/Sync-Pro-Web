import Usuario from "../models/user";
import jwt from 'jsonwebtoken'
import config from '../utils/config'

export const signUp = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Verifica si el usuario ya existe
      const existingUser = await Usuario.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
  
      // Encripta la contraseña antes de almacenarla en la base de datos
      const hashedPassword = await Usuario.encryptPassword(password);
  
      // Crea un nuevo usuario en la base de datos
      const newUser = await Usuario.create({
        username,
        password: hashedPassword,
      });
      const token = jwt.sign({id:newUser.id},config.SECRET,{
        expiresIn:7200
      })
      res.status(201).json({newUser, token});
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  export const signIn = async (req, res) => {
    try {
      const { Nombre, password } = req.body;

      // Busca el usuario por nombre de usuario
      const user = await Usuario.findOne({ where: { Nombre } });
  
      // Verifica si el usuario existe
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Compara la contraseña proporcionada con la almacenada en la base de datos
      const passwordMatch = await Usuario.comparePassword(password, user.pass_user);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      // Genera un token JWT para el usuario autenticado
      const token = jwt.sign({ id: user.id }, config.SECRET, {
        expiresIn: 7200,
      });

      // Selecciona solo los campos que necesitas del usuario
      const { id, nombre, esAdmin } = user;
  
      res.status(200).json({ user: { id, nombre, esAdmin }, token });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  export const users = async (req, res) => {
    try {
      const users = await Usuario.findAll({
        attributes: ['id', 'Nombre'],
      });
      res.json(users);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  export const perfil = async (req, res) => {
    const { user } = req;
    res.json(user);
  }

