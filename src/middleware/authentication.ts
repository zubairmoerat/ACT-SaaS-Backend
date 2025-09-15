import { Request, Response, NextFunction, RequestHandler } from "express";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import type { authToken } from "../types/auth/authToken";
import { RoleName, PermissionKey, DEFAULT_ROLE_PERMISSIONS } from "../types/auth/roles";
import logger from "../utils/logger";
import "dotenv/config";

interface AuthenticatedUser extends JwtPayload {
    id: number;
    companyId: number;
    role: RoleName;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

const secret = process.env.SECRET_KEY || "";

export function createToken(user: authToken): string {
    if(!user.id || user.companyId || user.role){
        logger.error("Invalid user payload for token creation.");
    }
    return sign(
        {
            id: user.id,
            companyId: user.companyId,
            role: user.role
        },
        secret,
        { expiresIn: '30min' }
    );
};

export function authenticateToken(req: Request, res:Response, next:NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        logger.error("Token not found.");
        res.status(401).json({
            msg: "Unauthorised. Please log in."
        });
        return;
    }
    let decoded: AuthenticatedUser | null = null;
    try{
        decoded = verify(token, secret) as AuthenticatedUser;
        req.user = decoded;
        next();
    }catch(error){
        if(error instanceof Error) {
            logger.error(`Authentication error: ${error.message}`);
            if(error.name === 'TokenExpiredError'){
                return res.status(401).json({
                    msg: "Token has expired. Please login again."
                });
            }
            if(error.name === 'JsonWebTokenError'){
                return res.status(403).json({
                    msg: "Invalid Token. Please login again."
                });
            }
        }
        logger.error(`Decoded token: ${JSON.stringify(decoded)}, Error: ${error}`);
        return res.status(403).json({
            msg: "Authentication failed. Please try again."
        });
    }
};

export const requireRole = (role: RoleName): RequestHandler => {
    return ( req: Request, res: Response, next: NextFunction ) => {
        const user = req.user;
        if(!user){
            return res.status(401).json({
                message: 'Unauthenticated'
            });
        }
        if(user.role !== role){
            logger.warn(`User:${user.id} with role:${user.role} attempted access requiring role=${role}`);
            return res.status(403).json({
                message: 'Forbidden.'
            });
        }
        next();
    };
};

export const requirePermission = (permission: PermissionKey): RequestHandler => {
    return (req:Request, res:Response, next:NextFunction) => {
        const user = req.user;
        if(!user){
            return res.status(401).json({
                message: 'Unauthenticated.'
            });
        }
        const permissions = DEFAULT_ROLE_PERMISSIONS[user.role];
        if(!permissions || !permissions[permission]){
            logger.warn(`User:${user.id} with role:${user.role} denied permission=${permission}`);
            return res.status(403).json({
                message: 'Forbidden.'
            });
        }
        next();
    };
};