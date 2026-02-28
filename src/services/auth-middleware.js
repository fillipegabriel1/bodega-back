import jwt from 'jsonwebtoken';

const mid = (req, res, next) => {
    // rotas liberadas sem token
    const noAuthRoutes = [
        "/api/user/login",
        "/api/user/register",
    ];

    // liberar login e cadastro
    if (noAuthRoutes.includes(req.path) && req.method === "POST") {
        return next();
    }

    // pegar header autorizado
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        next();
    });
};

export default mid;

