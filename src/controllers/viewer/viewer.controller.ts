import { Request, Response } from "express";
import { ComplianceItemService } from "../../services/complianceItem/compliance.service";
import { DocumentService } from "../../services/document/document.service";
import logger from "../../utils/logger";

const complianceService = new ComplianceItemService();
const documentService = new DocumentService();

export class viewerController {
    async getComplianceItemsByCompany(req:Request, res:Response){
        try{
            const { companyId } = req.params;
            const item = await complianceService.getByCompanyId(parseInt(companyId));
            return res.status(200).json(item);
        }catch(error){
            logger.error('Unable to get compliance items:', error);
            return res.status(500).json({
                message: 'Unable to get compliance items.'
            });
        }
    }

    async getComplianceItem(req: Request, res:Response){
        try{
            const { id } = req.params;
            const item = await complianceService.getComplianceItemById(parseInt(id));
            return res.status(200).json(item);
        }catch(error){
            logger.error('Unable to get compliance item:', error);
            return res.status(500).json({
                message: 'Unable to get compliance item.'
            });
        }
    }

    async getDocumentsByCompany(req:Request, res:Response){
        try{
            const { companyId } = req.params;
            const document = await documentService.getDocumentsByCompany(parseInt(companyId));
            return res.status(200).json(document);
        }catch(error){
            logger.error('Unable to get documents:', error);
            return res.status(500).json({
                message: 'Unable to get documents.'
            });
        }
    }

    async getDocumentById(req: Request, res: Response){
        try{
            const {id} = req.params;
            const document = await documentService.getDocumentById(parseInt(id));
            return res.status(200).json(document);
        }catch(error){
            logger.error('Unable to get document:', error);
            return res.status(500).json({
                message: 'Unable to get document.'
            });
        }
    }
}