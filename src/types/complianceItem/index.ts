import { Prisma } from "../../../generated/prisma";

export type ComplianceItemWithRelationsSafe = Prisma.ComplianceItemGetPayload<{
        include: {
            company: { select: { id: true, name: true } },
            reminders: {
                include: {
                    user: {
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
                };
            };
            documents: true;
        };
    }>;