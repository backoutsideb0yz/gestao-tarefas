import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization

    if(!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token não informado"});
    }

    const token = header.slice("Bearer ".length);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);

        if(typeof payload === "string" || !payload.sub) {
            return res.status(401).json({ message: "Token inválido"});
        }

        req.userId = payload.sub;
        return next();
    } catch {
        return res.status(401).jsonp({ message: "Token inválido ou expirado"});
    }
}