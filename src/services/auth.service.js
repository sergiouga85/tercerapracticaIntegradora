import  bcrypt  from 'bcrypt';
import { usersDao } from '../dao/index.js';
import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '../config/config.js'


class AuthService {

    async generateResetToken(email) {

        const user = await usersDao.findOne(email);
        console.log(user)

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const resetToken = jwt.sign({ email }, JWT_PRIVATE_KEY, { expiresIn: '1h' });
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora en milisegundos

        await user.save();

        return resetToken;
    }



    async resetPassword(token, newPassword){
        try {
          const user = await usersDao.findOnetoken({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
          });
      
          if (!user) {
            return { error: 'Token no válido o expirado' };
          }
      
          // Verificar que la nueva contraseña no sea igual a la anterior
          const isSamePassword = await bcrypt.compare(newPassword, user.password);
          if (isSamePassword) {
            return { error: 'No puedes usar la misma contraseña anterior' };
          }
      
          // Restablecer la contraseña y eliminar el token
          user.password = await bcrypt.hash(newPassword, 10);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
      
          await user.save();
      
          return { message: 'Contraseña restablecida con éxito' };
        } catch (error) {
          console.error(error);
          throw error;
        }
      };
}


export const authService = new AuthService()
