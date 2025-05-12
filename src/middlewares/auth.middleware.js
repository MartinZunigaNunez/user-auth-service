import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token no válido" });
    }
    req.user = user;
    next();
  });
}

//Vrificamos si es admin
export function isAdmin(req, res, next){
    if(req.user.role !== 'admin'){
        return res.status(403).json({ error: 'No tienes permisos para acceder a esta ruta' });
    }
    next();
}
