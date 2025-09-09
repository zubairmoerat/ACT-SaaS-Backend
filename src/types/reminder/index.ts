import { Prisma } from "../../../generated/prisma";

export type ReminderWithRelations = Prisma.ReminderGetPayload<{
    include: {
        user: { select: { id: true; name: true; email: true; googleId: true; role: true; companyId: true; createdAt: true } };
        complianceItem: { select: { id: true; title: true } };
    };
}>;