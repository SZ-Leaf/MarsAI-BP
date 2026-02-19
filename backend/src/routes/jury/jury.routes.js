import { Router } from "express";
import { juryList, findJuryById, createNewJuryMember } from "../../controllers/jury/jury.controller.js";
import { validate } from "../../middlewares/validation.js";
import { jurySchema } from "../../utils/schemas/jury.schema.js";
import { uploadJuryCover } from "../../middlewares/upload.js";


const router = Router();

router.get("/", juryList);
router.get("/:id", findJuryById );
router.post("/", uploadJuryCover, validate(jurySchema), createNewJuryMember,);
// router.put("/:id");
// router.delete("/:id");

export default router;