import { Router } from 'express';
import { registerUser, getCurrentUser, getAllUsers, passwordReset, passwordforgot, changeUserRole} from '../../controllers/users.controllers.js';
import {passportLocalRegister,passportAuth} from '../../middlewares/passport.js'



export const usersRouter = Router();

usersRouter.post('/',passportLocalRegister,registerUser);
usersRouter.get('/current',passportAuth,getCurrentUser);
usersRouter.get('/',passportAuth,getAllUsers); 
usersRouter.post('/forgotPassword',passwordforgot)
usersRouter.post('/resetPassword/:token',passwordReset);
usersRouter.post('/premium/:uid',changeUserRole);







