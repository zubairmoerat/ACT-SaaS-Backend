import db from "../../config/config";
import type { Company } from "../../../generated/prisma";
import type { CompanyWithRelationsSafe } from "../../types/company";
import logger from "../../utils/logger";

export class CompanyService {
    async getCompanyById(id: number): Promise<CompanyWithRelationsSafe> {
        const company = await db.company.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        googleId: true,
                        role: true,
                        companyId: true,
                        createdAt: true
                    },
                },
                items: true,
                documents: true
            },
        });
        if (!company) {
            logger.error(`Compant with id:${id} not found.`);
            throw new Error('Company not found.')
        }
        return company;
    }

    async getCompanies(): Promise<Company[]> {
        return db.company.findMany();
    }

    async getCompaniesWithRelations(): Promise<CompanyWithRelationsSafe[]> {
        const companies = await db.company.findMany({
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        googleId: true,
                        role: true,
                        companyId: true,
                        createdAt: true
                    },
                },
                items: true,
                documents: true
            },
        });
        return companies;
    }

    async createCompany(data: { name: string }): Promise<Company> {
        return db.company.create({
            data: { name: data.name }
        });
    }

    async updateCompany(id: number, data: Partial<{ name: string }>): Promise<Company> {
        try {
            const company = await db.company.update({
                where: { id },
                data,
            });
            return company;
        } catch (error: any) {
            if (error?.code === "P2025") {
                logger.error(`Company with id=${id} not found.`);
                throw new Error("Company not found.");
            }
            throw error;
        }
    }

    async deleteCompany(id: number): Promise<Company> {
        try {
            const company = await db.company.delete({
                where: { id },
            });
            return company;
        } catch (error: any) {
            if (error?.code === "P2025") {
                logger.error(`Company with id=${id} not found.`);
                throw new Error("Company not found.");
            }
            throw error;
        }
    }
}