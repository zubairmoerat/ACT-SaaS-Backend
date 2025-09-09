import { Prisma } from "../../../generated/prisma";

export type CompanyWithRelationsSafe = Prisma.CompanyGetPayload<{
    include: {
        users: {
            select: {
                id: true;
                name: true;
                email: true;
                googleId: true;
                role: true;
                companyId: true;
                createdAt: true;
            };
        };
        items: true;
        documents: true;
    };
}>;