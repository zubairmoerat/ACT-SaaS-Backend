import { RoleName } from "./roles";

declare global {
    namespace Express {
        interface User {
            id: number;
            role: RoleName;
            email?: string;
        }
        interface Request {
            user?: User;
        }
    }
}