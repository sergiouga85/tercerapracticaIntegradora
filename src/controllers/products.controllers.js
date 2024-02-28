import {productDao} from '../dao/index.js';
import  {ProductService} from '../services/product.service.js';

// Obtener todos los productos paginados

export const obtenerProductos = async (req, res) =>{
    try {
        let opciones = {}
        const filtro = (!req.query.filtro) ?  '' : { category: req.query.filtro }
        const itemsPorPagina = (!req.query.itemsPorPagina) ? opciones = { limit: 10, ...opciones } : opciones = { limit: req.query.itemsPorPagina, ...opciones }
        const pagina = (!req.query.pagina) ? opciones = { page: 1, ...opciones } : opciones = { page: req.query.pagina, ...opciones }
        const orden = (!req.query.order) ? '' : opciones = { sort: { 'price': req.query.order }, ...opciones }
        console.log(opciones)
        const paginado = await productDao.paginado(filtro, opciones)
        console.log(paginado)
        const resoults = {
            status: 'success',
            payload: paginado.docs,
            totalPages: paginado.totalPages,
            prevPage: paginado.prevPage,
            nextPage: paginado.nextPage,
            page: paginado.page,
            hasPrevPage: paginado.hasPrevPage,
            hasNextPage: paginado.hasNextPage,
            prevLink: '',
            nextLink: ''
        }

        res.json(resoults)
    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener todas las categorías de productos
export const obtenerCategorias = async (req, res) => {
    try {
        const categoriasProductos = await productDao.obtenerCategorias();

        res.json(categoriasProductos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
    try {
        const productoPorId = await productDao.obtenerProductoPorId(req.params.pid);
        res.json(productoPorId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo producto
export const crearProducto = async (req, res) => {
    try {
        const nuevoProductoData = req.body;

        // Validar que el precio del nuevo producto no sea negativo
        if (nuevoProductoData.price < 0) {
            return res.status(400).json({ message: 'El precio del producto no puede ser negativo.' });
        }

        // Lógica para obtener el usuario actual (asumiendo que esté almacenado en req.user)
        const usuarioActual = req.user;
        console.log(usuarioActual.rol)
        // Lógica para verificar si el usuario tiene permisos para crear productos
        if (usuarioActual.rol !== 'premium' && usuarioActual.rol !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para crear productos.' });
        }

        // Llamar al servicio para crear el producto y asignar el owner
        const nuevoProducto = await ProductService.crearProducto(usuarioActual._id, nuevoProductoData);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ message: `Error en el controlador de productos: ${error.message}` });
    }
};

// Actualizar un producto por ID
export const actualizarProducto = async (req, res) => {
    try {
        const productoId = req.params.pid;
        const usuarioId = req.user._id; // Suponiendo que tienes la información del usuario en el objeto req.user
        const newData = req.body;
        // Llama al DAO para actualizar el producto con las restricciones
        const updProducto = await productDao.actualizarProducto(productoId, usuarioId, newData);
        // Devuelve la respuesta con el producto actualizado
        res.json(updProducto);
    } catch (error) {
        // Maneja los errores y envía una respuesta adecuada al cliente
        res.status(500).json({ message: error.message });
    }
};


// Eliminar un producto por ID
export const eliminarProducto = async (req, res) => {
    try {
        const productoId = req.params.pid;
        const usuarioId= req.user._id; // Suponiendo que tienes la información del usuario en el objeto req.user
        
        // Llama al DAO para eliminar el producto con las restricciones
        const delProducto = await productDao.eliminarProducto(productoId, usuarioId);

        // Devuelve la respuesta con el producto eliminado
        res.json(delProducto);
    } catch (error) {
        // Maneja los errores y envía una respuesta adecuada al cliente
        res.status(500).json({ message: error.message });
    }
};


