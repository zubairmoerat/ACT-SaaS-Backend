import db from "../../config/config";
import type { Reminder } from "../../../generated/prisma";
import type { ReminderWithRelations } from "../../types/reminder";
import logger from "../../utils/logger";

export class ReminderService {
    async getReminderById(id: number): Promise<ReminderWithRelations> {
        const r = await db.reminder.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true, googleId: true, role: true, companyId: true, createdAt: true } },
                complianceItem: { select: { id: true, title: true } },
            },
        });
        if (!r) {
            logger.error(`Reminder with id=${id} not found.`);
            throw new Error("Reminder not found.");
        }
        return r;
    }

    async getReminders(): Promise<Reminder[]> {
        return db.reminder.findMany();
    }

    async getRemindersForItem(itemId: number): Promise<ReminderWithRelations[]> {
        return db.reminder.findMany({
            where: { itemId },
            include: {
                user: { select: { id: true, name: true, email: true, googleId: true, role: true, companyId: true, createdAt: true } },
                complianceItem: { select: { id: true, title: true } },
            },
            orderBy: { scheduleAt: "asc" },
        });
    }

    async createReminder(data: {
        type: string;
        scheduleAt: Date;
        message: string;
        itemId?: number | null;
        userId?: number | null;
    }): Promise<Reminder> {
        return db.reminder.create({
            data: {
                type: data.type,
                scheduleAt: data.scheduleAt,
                message: data.message,
                itemId: data.itemId ?? null,
                userId: data.userId ?? null,
            },
        });
    }

    async updateReminder(id: number, data: Partial<{
        type: string;
        scheduleAt: Date;
        sent: boolean;
        message: string;
        itemId?: number | null;
        userId?: number | null;
    }>): Promise<Reminder> {
        try {
            return await db.reminder.update({ where: { id }, data });
        } catch (error: any) {
            if (error?.code === "P2025") {
                logger.error(`Reminder with id=${id} not found.`);
                throw new Error("Reminder not found.");
            }
            throw error;
        }
    }

    async deleteReminder(id: number): Promise<Reminder> {
        try {
            return await db.reminder.delete({ where: { id } });
        } catch (error: any) {
            if (error?.code === "P2025") {
                logger.error(`Reminder with id=${id} not found.`);
                throw new Error("Reminder not found.");
            }
            throw error;
        }
    }

    async markAsSent(id: number): Promise<Reminder> {
        return this.updateReminder(id, { sent: true });
    }
}