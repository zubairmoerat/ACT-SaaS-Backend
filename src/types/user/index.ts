import { Prisma } from "../../../generated/prisma";

export type UserWithCompany = Prisma.UserGetPayload<{
    include: { company: true };
}>;

export function sanitizeUser<T extends { password?: string }>(user: T): Omit<T, 'password'>{
    const { password, ...safeUser } = user;
    return safeUser;
}