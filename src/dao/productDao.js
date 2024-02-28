import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';
import mongoosePaginate from 'mongoose-paginate-v2';
import { usersDao } from '../dao/index.js';

const productSchema = new Schema({
    _id: { type: String, default: randomUUID },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    owner: { type: String, ref: 'users' } // Puedes cambiar el valor predeterminado según tus necesidades
}, {
    strict: 'throw',
    versionKey: false,
});

productSchema.plugin(mongoosePaginate);

export const Producto = model('products', productSchema);



//------------------------------------------------------------------------------------------


export class ProductDao {

    async getProducts(){
        try {
            const products= await Producto.find();
            return products   
        } catch (error) {
            throw new Error(`Error al obtener los productos  ${error.message}`);
        }
    }

    // Obtener todos los productos paginados
    async paginado(filtro, opciones){
        try {
            const paginado= await Producto.paginate(filtro, opciones);
            return paginado   
        } catch (error) {
            throw new Error(`Error al obtener los productos paginados: ${error.message}`);
        }
    };

    // Obtener todas las categorías de productos
    async obtenerCategorias(){
        try {
            const categoriasProductos = await Producto.aggregate([
                { $group: { _id: "$category" } }
            ]);

            return categoriasProductos;
        } catch (error) {
            throw new Error(`Error al obtener las categorías de productos: ${error.message}`);
        }
    };

    // Obtener un producto por ID
    async obtenerProductoPorId(productoId)  {
        try {
            const productoPorId = await Producto.findById(productoId);

            if (!productoPorId) {
                throw new Error('El producto buscado no existe en la base de datos');
            }

            return productoPorId;
        } catch (error) {
            throw new Error(`Error al obtener el producto por ID: ${error.message}`);
        }
    };

    // Crear un nuevo producto
    async crearProducto(usuarioId, nuevoProductoData) {
        try {
          // Asigna el propietario al ID del usuario premium
          nuevoProductoData.owner = usuarioId;
      
          const nuevoProducto = await Producto.create(nuevoProductoData);
          return nuevoProducto;
        } catch (error) {
          throw new Error(`Error al crear un nuevo producto: ${error.message}`);
        }
    }

    // Actualizar un producto por ID
    async  actualizarProducto(productoId, usuarioId, newData) {
        try {
          // Verificar si el usuario es admin o premium antes de permitir la modificación
          const usuario = await usersDao.findByIdUser(usuarioId);
      
          if (!usuario) {
            throw new Error('Usuario no encontrado');
          }
      
          if (!(usuario.rol === 'admin' || usuario.rol === 'premium')) {
            throw new Error('No tienes permisos para modificar productos');
          }
      
          // Verificar si el producto existe
          const producto = await Producto.findById(productoId);
      
          if (!producto) {
            throw new Error(`El producto con ID ${productoId} no se encontró`);
          }
      
          // Verificar si el usuario tiene permisos para modificar este producto
          if (!(usuario.rol === 'admin' || producto.owner.toString() === usuario._id)) {
            throw new Error('No tienes permisos para modificar este producto');
          }
      
          // Verificar si se intenta modificar el código del producto
          if (newData.code) {
            throw new Error('No se puede modificar el código del producto');
          }
      
          // Actualizar el producto
          const updProducto = await Producto.findByIdAndUpdate(
            productoId,
            { $set: newData },
            { new: true }
          );
      
          if (!updProducto) {
            throw new Error(`El producto con ID ${productoId} no se encontró`);
          }
      
          return updProducto;
        } catch (error) {
          throw new Error(`Error al actualizar el producto por ID: ${error.message}`);
        }
      }

    // Eliminar un producto por ID
    async eliminarProducto(productoId, usuarioId) {
        try {
            // Verificar si el usuario es admin o premium antes de permitir la eliminación
            const usuario = await usersDao.findByIdUser(usuarioId);
    
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
    
            // Verificar si el usuario tiene el rol de admin o premium
            if (usuario.rol !== 'admin' && usuario.rol !== 'premium') {
                throw new Error('No tienes permisos para eliminar productos');
            }
    
            // Verificar si el producto existe
            const producto = await Producto.findById(productoId);

            console.log('el producto lo creo el siguiente usuario ', producto.owner)
            console.log('el producto lo quiere eliminar el usuario ',usuarioId)
    
            // Verificar si el usuario tiene permisos para eliminar este producto
            if (producto.owner.toString() !== usuarioId) {
                throw new Error('No tienes permisos para modificar este producto');
            }
    
            const delProducto = await Producto.findByIdAndDelete(productoId);
    
            if (!delProducto) {
                throw new Error(`El producto con id ${productoId} no se encontró`);
            }
    
            return delProducto;
        } catch (error) {
            throw new Error(`Error al eliminar el producto por ID: ${error.message}`);
        }
    }

}