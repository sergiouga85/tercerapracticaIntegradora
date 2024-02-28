export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.rol === 'admin') {
    console.log(req.user.rol)
    return next();
  }
  res.status(403).send('Acceso no autorizado');
};

export const isPremium= (req, res, next)=> {
  if (req.isAuthenticated() && (req.user.rol === 'premium' || req.user.rol === 'admin')) {
    next(); // Si el usuario es premium o admin, permitir el acceso
  } else {
    return res.status(403).json({ message: 'Acceso no autorizado para usuarios premium' });
  }
}

export const isUser = (req, res, next) => {
  if (req.isAuthenticated() && (req.user.rol === 'user'|| req.user.rol === 'premium') ) {
    return next();
  }
  res.status(403).send('Acceso no autorizado');
}




  

  


