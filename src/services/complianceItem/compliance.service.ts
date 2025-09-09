import db from "../../config/config";
import { ComplianceItem } from "../../../generated/prisma";
import type { ComplianceItemWithRelationsSafe } from "../../types/complianceItem";
import logger from "../../utils/logger";

export class ComplianceItemService {
    async getComplianceItemById(id: number): Promise<ComplianceItemWithRelationsSafe> {
        const item = await db.complianceItem.findUnique({
            where: { id },
            include: {
                company: { select: { id: true, name: true } },
                reminders: { include: { user: { select: { id: true, name: true, email: true, googleId: true, role: true, companyId: true, createdAt: true } } } },
                documents: true
            }
        });
        if (!item) {
            logger.error(`ComplianceItem with id:${id} not found.`);
            throw new Error('Compliance item not found.');
        }
        return item;
    }

    async getComplianceItems(): Promise<ComplianceItem[]> {
        return db.complianceItem.findMany();
    }

    async getByCompanyId(companyId: number): Promise<ComplianceItemWithRelationsSafe[]> {
        return db.complianceItem.findMany({
            where: { companyId },
            include: {
                company: { select: { id: true, name: true } },
                reminders: { include: { user: { select: { id: true, name: true, email: true, googleId: true, role: true, companyId: true, createdAt: true } } } },
                documents: true,
            },
            orderBy: { dueDate: 'asc' },
        });
    }

    async createComplianceItem(data: {
        title: string;
        description?: string | null;
        dueDate: Date;
        frequency: string;
        companyId: number;
    }): Promise<ComplianceItem> {
        return db.complianceItem.create({
            data: {
                title: data.title,
                description: data.description ?? null,
                dueDate: data.dueDate,
                frequency: data.frequency,
                companyId: data.companyId,
            },
        });
    }

    async updateComplianceItem(id: number, data: Partial<{
        title: string;
        description?: string | null;
        dueDate: Date;
        frequency: string;
        companyId: number;
    }>): Promise<ComplianceItem> {
        try {
            return await db.complianceItem.update({ where: { id }, data });
        } catch (error: any) {
            if (error?.code === "P2025") {
                logger.error(`ComplianceItem with id=${id} not found.`);
                throw new Error("Compliance item not found.");
            }
            throw error;
        }
    }

    async deleteComplianceItem(id:number):Promise<ComplianceItem>{
        try{
            return await db.$transaction(async(tx) => {
                await tx.document.deleteMany({
                    where: { itemId: id },
                });
                await tx.reminder.deleteMany({ where: { itemId: id } });
                const deleted = await tx.complianceItem.delete({ where: { id } });
                return deleted;
            })
        }catch(error: any){
            if(error?.code === 'P2025'){
                logger.error(`ComplianceItem with id:${id} not found.`);
                throw new Error('Compliance not found.');
            }
            throw error;
        }
    }

    async addReminderToItem(itemId: number, data:{
        type: string;
        scheduleAt: Date;
        message: string;
        userId?: number | null;
    }){
        const item = await db.complianceItem.findUnique({ where: { id: itemId } });
        if(!item){
            logger.error(`Cannot add reminder: item id:${itemId} not found.`);
            throw new Error('Compliance item not found.');
        }
        return db.reminder.create({
            data: {
                type: data.type,
                scheduleAt: data.scheduleAt,
                message: data.message,
                itemId,
                userId: data.userId ?? null,
            },
        });
    }
}