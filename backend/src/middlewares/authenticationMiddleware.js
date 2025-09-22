import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.status(401).json({ error: "Falta token de autorización" });

    if (!authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Formato de token inválido" });


    const token = authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Falta token de autorización" });

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ error: "Tóken no válido" });
    }
}