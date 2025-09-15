import { Request, Response } from 'express';
import { CompanyService } from '../../services/company/company.service';
import { UserService } from '../../services/user/user.service';
import { ComplianceItemService } from '../../services/complianceItem/compliance.service';
import { DocumentService } from '../../services/document/document.service';
import { ReminderService } from '../../services/reminder/reminder.service';
import logger from '../../utils/logger';

const companyService = new CompanyService();
const userService = new UserService();
const complianceService = new ComplianceItemService();
const documentService = new DocumentService();
const reminderService = new ReminderService();

export class AdminController {
    async getCompany(req: Request, res:Response){
        try{
            const { id } = req.params;
            const company = await companyService.getCompanyById(parseInt(id));
            return res.status(200).json(company);
        }catch(error){
            logger.error('Unable to get company.', error);
            return res.status(500).json({
                messsage: 'Unable to get company.'
            });
        }
    }

    async createCompany(req: Request, res: Response) {
        try {
            const company = await companyService.createCompany(req.body);
            return res.status(201).json(company);
        } catch (error) {
            logger.error('Error creating company:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCompany(req:Request, res:Response){
        try{
            const { id } = req.params;
            const { data } = req.body;
            const company = await companyService.updateCompany(parseInt(id), data);
            return res.status(200).json(company);
        }catch(error){
            logger.error('Unable to update company:', error);
            return res.status(500).json({
                message: 'Unable to update company.'
            });
        }
    }

    async deleteCompany(req:Request, res:Response){
        try{
            const { id } = req.params;
            const company = await companyService.deleteCompany(parseInt(id));
            return res.status(200).json(company);
        }catch(error){
            logger.error('Unable to delete company:', error);
            return res.status(500).json({
                message: 'Unable to delete company.'
            });
        }
    }

    async getUser(req:Request, res:Response){
        try{
            const { id } = req.params;
            const user = await userService.getUserById(parseInt(id));
            return res.status(200).json(user);
        }catch(error){
            logger.error('Unable to get user:', error);
            return res.status(500).json({
                message: 'Unable to get user.'
            });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const user = await userService.createUser(req.body);
            return res.status(201).json(user);
        } catch (error) {
            logger.error('Error creating user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUserRole(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { role } = req.body;
            const user = await userService.updateUser(parseInt(userId, 10), { role });
            return res.status(200).json(user);
        } catch (error) {
            logger.error('Error updating user role:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllCompliance(req: Request, res: Response) {
        try {
            const { companyId } = req.params;
            const compliance = await complianceService.getByCompanyId(parseInt(companyId));
            return res.status(200).json(compliance);
        } catch (error) {
            logger.error('Error fetching compliance items:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createCompliance(req: Request, res: Response) {
        try {
            const compliance = await complianceService.createComplianceItem(req.body);
            return res.status(201).json(compliance);
        } catch (error) {
            logger.error('Error creating compliance item:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCompliance(req: Request, res:Response){
        try{
            const { id } = req.params;
            const { data } = req.body;
            const item = await complianceService.updateComplianceItem(parseInt(id),data);
            return res.status(200).json(item);
        }catch(error){
            logger.error('Unable to update item:', error);
            return res.status(500).json({
                message:'Unable to update item.'
            });
        }
    }

    async deleteCompliance(req:Request, res:Response){
        try{
            const { id } =req.params;
            const item = await complianceService.deleteComplianceItem(parseInt(id));
            return res.status(200).json(item);
        }catch(error){
            logger.error('Unable to delete item.');
            return res.status(500).json({
                message: 'Unable to delete item.'
            });
        }
    }

    async getAllDocuments(req: Request, res: Response) {
        try {
            const { companyId } = req.params;
            const documents = await documentService.getDocumentsByCompany(parseInt(companyId));
            return res.status(200).json(documents);
        } catch (error) {
            logger.error('Error fetching documents:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createDocument(req: Request, res: Response) {
        try {
            const document = await documentService.createDocument(req.body);
            return res.status(201).json(document);
        } catch (error) {
            logger.error('Error creating document:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateDocument(req:Request, res:Response){
        try{
            const { id } = req.params;
            const { data } = req.body;
            const doc = await documentService.updateDocument(parseInt(id), data);
            return res.status(200).json(doc);
        }catch(error){
            logger.error('Unable to update doc:', error);
            return res.status(500).json({
                message: 'Unable to update document.'
            });
        }
    }

    async getAllReminders(req: Request, res: Response) {
        try {
            const { itemId } = req.params;
            const reminders = await reminderService.getRemindersForItem(parseInt(itemId));
            return res.status(200).json(reminders);
        } catch (error) {
            logger.error('Error fetching reminders:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createReminder(req: Request, res: Response) {
        try {
            const reminder = await reminderService.createReminder(req.body);
            return res.status(201).json(reminder);
        } catch (error) {
            logger.error('Error creating reminder:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateReminder(req:Request, res:Response){
        try{
            const { id } = req.params;
            const { data } = req.body;
            const reminder = await reminderService.updateReminder(parseInt(id), data);
            return res.status(200).json(reminder);
        }catch(error){
            logger.error('Unable to update reminder:', error);
            return res.status(500).json({
                message: 'Unable to update reminder.'
            });
        }
    }

    async deleteReminder(req:Request, res:Response){
        try{
            const { id } = req.params;
            const reminder = await reminderService.deleteReminder(parseInt(id));
            return res.status(200).json(reminder);
        }catch(error){
            logger.error('Unable to delete reminder:', error);
            return res.status(500).json({
                message: 'Unable to delete reminder.'
            });
        }
    }
}
