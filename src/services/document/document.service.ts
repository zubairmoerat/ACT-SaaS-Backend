import db from "../../config/config";
import type { Document } from "../../../generated/prisma";
import type { DocumentWithRelations } from "../../types/document";
import logger from "../../utils/logger";

export class DocumentService {
    async getDocumentById(id: number): Promise<DocumentWithRelations> {
        const doc = await db.document.findUnique({
            where: { id },
            include: {
                complianceItem: { select: { id: true, title: true, companyId: true } },
                company: { select: { id: true, name: true } },
            },
        });
        if (!doc) {
            logger.error(`Document with id:${id} not found.`);
            throw new Error('Document not found.');
        }
        return doc;
    }

    async getDocuments(): Promise<Document[]> {
        return db.document.findMany();
    }

    async getDocumentsByCompany(companyId: number): Promise<DocumentWithRelations[]> {
        return db.document.findMany({
            where: { companyId },
            include: {
                complianceItem: { select: { id: true, title: true, companyId: true } },
                company: { select: { id: true, name: true } },
            },
            orderBy: { id: 'desc' },
        });
    }

    async getDocumentByItem(itemId: number): Promise<DocumentWithRelations[]> {
        return db.document.findMany({
            where: { itemId },
            include: {
                complianceItem: { select: { id: true, title: true, companyId: true } },
                company: { select: { id: true, name: true } },
            },
        });
    }

    async createDocument(data: {
        name: string;
        fileUrl: string;
        expiryDate?: Date | null;
        companyId: number;
        itemId?: number | null;
    }): Promise<Document> {
        return db.document.create({
            data: {
                name: data.name,
                fileUrl: data.fileUrl,
                expiryDate: data.expiryDate ?? null,
                companyId: data.companyId,
                itemId: data.itemId ?? null,
            },
        });
    }

    async updateDocument(id: number, data: Partial<{
        name: string;
        fileUrl: string;
        expiryDate?: Date | null;
        companyId: number;
        itemId?: number | null;
    }>): Promise<Document> {
        try {
            return await db.document.update({ where: { id }, data });
        } catch (error: any) {
            if (error?.code === "P2025") {
                logger.error(`Document with id=${id} not found.`);
                throw new Error("Document not found.");
            }
            throw error;
        }
    }

    async deleteDocument(id: number): Promise<Document> {
        try {
            return await db.document.delete({ where: { id } });
        } catch (error: any) {
            if (error?.code === "P2025") {
                logger.error(`Document with id=${id} not found.`);
                throw new Error("Document not found.");
            }
            throw error;
        }
    }
}