import { error } from "console";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    // if (req.path === "/login") return next();
    if (req.session) {
        if (req.session.message) {
            res.locals.message = req.session.message;
            delete req.session.message;
        } else {
            res.locals.message = undefined;
        }

        if (!req.session.user) {
            req.session.message = { type: "ERROR", content: "Please login first." };
            return res.redirect("/login");
        }

        next();
    } else {
        res.status(500).send("Session not initialized.");
    }
}

