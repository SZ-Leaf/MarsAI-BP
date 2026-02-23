import { Router } from "express";
import { juryList, findJuryById, createNewJuryMember, deleteMemberById, updateMemberById } from "../../controllers/jury/jury.controller.js";
import { validate } from "../../middlewares/validation.js";
import { jurySchema } from "../../utils/schemas/jury.schema.js";
import { uploadJuryCover } from "../../middlewares/upload.js";
import { authenticate, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", juryList);
router.get("/:id", findJuryById );
router.post("/", authenticate, requireRole([2, 3]), uploadJuryCover, validate(jurySchema), createNewJuryMember,);
router.delete("/:id", authenticate, requireRole([2, 3]), deleteMemberById);
router.put("/:id", authenticate, requireRole([2, 3]), uploadJuryCover, validate(jurySchema), updateMemberById);

export default router;

