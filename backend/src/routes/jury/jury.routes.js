import { Router } from "express";
import { juryList, findJuryById } from "../../controllers/jury/jury.controller.js";


const router = Router();

router.get("/", juryList);
router.get("/:id", findJuryById );
// router.post("/");
// router.put("/:id");
// router.delete("/:id");

export default router;