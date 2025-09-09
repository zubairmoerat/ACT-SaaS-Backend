import db from "../../config/config";
import type { User } from '../../../generated/prisma/client';
import { RoleName } from "../../types/auth/roles";
import { sanitizeUser } from "../../types/user";
import { hashPassword } from "../../utils/passwordUtils";
import logger from "../../utils/logger";


export class UserService {
    async getUserById(id:number):Promise<Omit<User, 'password'>>{
        const user = await db.user.findUnique({
            where: { id }
        });
        if(!user){
            logger.error(`User with ${id} not found.`);
            throw new Error('User not found.');
        }
        return sanitizeUser(user);
    }

    async getUsers():Promise<Omit<User, 'password'>[]>{
        const users = await db.user.findMany();
        return users.map(sanitizeUser);
    }

    async createUser( data: {
        email: string,
        name: string,
        password: string,
        googleId?: string,
        role: RoleName,
        companyId: number
    }
    ):Promise<Omit<User, 'password'>>{
        const encryption = await hashPassword(data.password);
        const user = await db.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: encryption,
                googleId: data.googleId,
                role: data.role,
                companyId: data.companyId
            }
        });
        return sanitizeUser(user);
    }

    async updateUser(id:number, data: Partial<{ 
        email: string,
        name: string,
        password: string,
        googleId?: string,
        role: RoleName,
        companyId: number
    }>):Promise<Omit<User, 'password'>>{
        try{
            const updateData = { ...data };
            if(data.password){
                updateData.password = await hashPassword(data.password);
            }
            const user = await db.user.update({
                where: { id },
                data: updateData,
            });
            return sanitizeUser(user);
        }catch(error:any){
            if(error.code === 'P2025'){
                logger.error(`User with id:${id} not found.`);
                throw new Error('User not found.')
            }
            throw error;
        }
    }

    async deleteUser(id:number):Promise<Omit<User, 'password'>>{
        try{
            const user = await db.user.delete({
                where: { id },
            });
            return sanitizeUser(user);
        }catch(error:any){
            if(error.code === 'P2025'){
                logger.error(`User with id:${id} not found.`);
                throw new Error("User not found.");
            }
            throw error;
        }
    }
}