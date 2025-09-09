import { Prisma } from "../../../generated/prisma";

export type DocumentWithRelations = Prisma.DocumentGetPayload<{
    include: {
        complianceItem: {
            select: {
                id: true;
                title: true;
                companyId: true;
            }
        };
        company: {
            select: {
                id: true;
                name: true;
            }
        };
    };
}>;