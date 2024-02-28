import {productDao} from '../dao/index.js';

export class ProductService {
    static crearProducto = async (ownerId, nuevoProductoData) => {
        try {
            // Validar que el precio del nuevo producto no sea negativo
            if (nuevoProductoData.price < 0) {
                throw new Error('El precio del producto no puede ser negativo.');
            }

            // Luego, creas el producto usando el DAO
            console.log(ownerId)
            return await productDao.crearProducto(ownerId, nuevoProductoData);
        } catch (error) {
            throw new Error(`Error en el servicio de productos: ${error.message}`);
        }
    };
}