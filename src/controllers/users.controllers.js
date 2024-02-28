import  bcrypt  from 'bcrypt';
import { usersDao } from '../dao/index.js';
import { appendJwtAsCookie } from './authentication.business.js';
import {UserDTO} from '../dto/userDto.js';
import  {authService}  from '../services/auth.service.js';
import {emailService}  from '../services/email.service.js';


export const registerUser = async (req, res, next) => {
  try {
    appendJwtAsCookie,
    res['successfullPost'](req.user);
  } catch (error) {
    next(error);
  }
}

export const getCurrentUser = async (req, res, next) => {
  try {
    
    // Crear un DTO del usuario con la información necesaria
    const userDTO = new UserDTO(req.user);
    res['successfullGet'](userDTO);
  } catch (error) {
    next(error);
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    authorizationMiddleware(['admin']);
    const usuarios = await usersDao.findAllUsers();
    res['successfullGet'](usuarios);
  } catch (error) {
    next(error);
  }
};

export const getfindUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user =await usersDao.readOne(email);
    return res.json(user);
  } catch (error) {
    next(error);
  }

}

  

export const passwordforgot= async (req, res, next)=>{
  try {
    const { email } = req.body;
    console.log(email);
    const resetToken = await authService.generateResetToken(email);

    // Construir el enlace de restablecimiento
    const resetLink = `http://localhost:8080/api/users/resetPassword/${resetToken}`;
    
    // Configurar el correo
    const asunto = 'Restablecimiento de Contraseña';
    const mensaje = `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`;

    // Enviar el correo
    await emailService.send(email, asunto, mensaje);

    return res.json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


export const passwordReset = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const result = await authService.resetPassword(token, newPassword);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export  const changeUserRole= async(req, res)=> {
    try {
      const userId = req.params.uid;
      const newRole = req.body.role; // El nuevo rol, puede ser 'premium' o 'user'
  
      // Utilizar usersDao para cambiar el rol del usuario en la base de datos
      const updatedUser = await usersDao.cambiarRolUsuario(userId, newRole);
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
}

