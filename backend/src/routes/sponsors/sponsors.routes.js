import { Router } from 'express';
import {createSponsorController, deleteSponsorController, getSponsorsController} from '../../controllers/sponsors/sponsors.controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, requireRole([2, 3]), uploadSubmissionFiles, handleUploadError, createSponsorController);
router.delete('/:id', authenticate, requireRole([2, 3]), deleteSponsorController);
router.get('/', getSponsorsController);


export default router;
