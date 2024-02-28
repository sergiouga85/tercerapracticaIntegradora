import { Router } from 'express';
import { obtenerProductos, obtenerCategorias, obtenerProductoPorId,crearProducto,actualizarProducto,eliminarProducto} from '../../controllers/products.controllers.js';
import { adminsOnly, premiumOnly } from '../../middlewares/authorization.js';
import {passportAuth} from '../../middlewares/passport.js'


export const productosRouter = Router();

productosRouter.get('/', obtenerProductos);
productosRouter.get('/cat/', obtenerCategorias);
productosRouter.get('/:pid', obtenerProductoPorId);
productosRouter.post('/', passportAuth,premiumOnly, crearProducto);
productosRouter.put('/:pid',passportAuth,premiumOnly, actualizarProducto);
productosRouter.delete('/:pid', passportAuth,premiumOnly, eliminarProducto);