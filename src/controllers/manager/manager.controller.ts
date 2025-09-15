import { Request, Response } from "express";
import { ComplianceItemService } from '../../services/complianceItem/compliance.service';
import { DocumentService } from '../../services/document/document.service';
import { ReminderService } from '../../services/reminder/reminder.service';
import logger from "../../utils/logger";

const complianceService = new ComplianceItemService();
const documentService = new DocumentService();
const reminderService = new ReminderService();

export class ManagerController {
    async getAllComplianceItemsForCompany(req:Request, res:Response){
        try{
            const { companyId } = req.params;
            const items = await complianceService.getByCompanyId(parseInt(companyId));
            return res.status(200).json(items);
        }catch(error){
            logger.error('Error fetching compliance items:',error);
            return res.status(404).json({ 
                message: 'Error fetching items.' 
            });
        }
    }

    async getComplianceItemById(req:Request, res:Response){
        try{
            const { itemId } = req.params;
            const item = await complianceService.getComplianceItemById(parseInt(itemId));
            return res.status(200).json(item);
        }catch(error){
            logger.error('Error fetching compliance item:', error);
            return res.status(404).json({
                message: 'Error fetching item.'
            });
        }
    }

    async createComplianceItem(req:Request, res:Response){
        try{
            const item = await complianceService.createComplianceItem(req.body);
            return res.status(201).json(item);
        }catch(error){
            logger.error('Error creating item:', error);
            return res.status(404).json({
                message: 'Error creating compliance item.'
            });
        }
    }

    async updateComplianceItem(req:Request, res:Response){
        try{
            const { itemId } = req.params;
            const item = await complianceService.updateComplianceItem(parseInt(itemId), req.body);
            return res.status(200).json(item);
        }catch(error){
            logger.error('Error updating item:', error);
            return res.status(404).json({
                message: 'Unable to update item.'
            });
        }
    }

    async deleteComplianceItem(req:Request, res:Response){
        try{
            const { itemId } = req.params;
            const item = await complianceService.deleteComplianceItem(parseInt(itemId));
            return res.status(200).json(item);
        }catch(error){
            logger.error('Unable to delete item:', error);
            return res.status(404).json({
                message: 'Unable to delete item.'
            });
        }
    }

    async getAllDocumentsForCompany(req:Request, res:Response){
        try{
            const { companyId } = req.params;
            const docs = await documentService.getDocumentsByCompany(parseInt(companyId));
            return res.status(200).json(docs);
        }catch(error){
            logger.error('Error fetching company documents:', error);
            return res.status(404).json({
                message: 'Error fetching company documents.'
            });
        }
    }

    async createDocument(req:Request, res:Response){
        try{
            const doc = documentService.createDocument(req.body);
            return res.status(201).json(doc);
        }catch(error){
            logger.error('Unable to create document:', error);
            return res.status(404).json({
                message: 'Unable to create document.'
            });
        }
    }

    async updateDocument(req:Request, res:Response){
        try{
            const { id } = req.params;
            const { data } = req.body;
            const doc = await documentService.updateDocument(parseInt(id), data);
            return res.status(200).json(doc);
        }catch(error){
            logger.error('Unable to update document:', error);
            return res.status(500).json({
                message: 'Unable to update doc.'
            });
        }
    }

    async deleteDocument(req:Request, res:Response){
        try{
            const { id } = req.params;
            const doc = await documentService.deleteDocument(parseInt(id));
            return res.status(200).json(doc);
        }catch(error){
            logger.error('Unable to delete document:', error);
            return res.status(500).json({
                message: 'Unable to delete document.'
            });
        }
    }

    async getReminders(req:Request, res:Response){
        try{
            const { id } = req.params;
            const reminder = await reminderService.getRemindersForItem(parseInt(id));
            return res.status(200).json(reminder);
        }catch(error){
            logger.error('Unable to get reminders for compliance items:', error);
            return res.status(500).json({
                message: 'Unable to fetch reminders.'
            });
        }
    }

    async createReminder(req:Request, res:Response){
        try{
            const { data } = req.body;
            const reminder = await reminderService.createReminder(data);
            return res.status(201).json(reminder);
        }catch(error){
            logger.error('Unable to create reminder for compliance items:', error);
            return res.status(500).json({
                message: 'Unable to create reminder.'
            });
        }
    }

    async updateReminder(req:Request, res:Response){
        try{
            const {id} = req.params;
            const { data } = req.body;
            const reminder = await reminderService.updateReminder(parseInt(id), data);
            return res.status(200).json(reminder);
        }catch(error){
            logger.error('Unable to update reminder for compliance items:', error);
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
            logger.error('Unable to delete reminder for compliance items:', error);
            return res.status(500).json({
                message: 'Unable to delete reminder.'
            });
        }
    }
}