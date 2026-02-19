import { sendSuccess, sendError } from "../../helpers/response.helper.js";
import juryModel from "../../models/jury/jury.model.js"

export const juryList = async(req, res) => {
    try {
        const jurys = await juryModel.getAllJuryMembers();
        if (!jurys || jurys.length === 0) {
      return sendError(res, 404, "La liste des membres du jury est vide", "The jury list is empty", null);
    }
        
        return sendSuccess(res, 200, "Liste des membres du jury récupérée avec succès","List of jury members retrieved with succes",jurys)
    } catch (error) {
        console.error("Erreur juryList:", error);
        return sendError(res, 500, "Impossible de récupérer la liste du jury", null );
    }
}
export const findJuryById = async (req,res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return sendError(res, 400, "Id invalide", "Invalid id", null);
        }
        const jury = await juryModel.getJuryMemberById(id);

        if (!jury) {
            return sendError(res, 404, "Membre du jury introuvable", "Jury member not found", null);
        }

        return sendSuccess(res, 200, `Membre du jury numéro ${id} récupéré avec succés`, `Jury member number ${id} succesfully`, jury )
    } catch (error) {
        console.error("Erreur findByJuryId:", error);
        return sendError(res, 500, "Impossible de récupérer ce membre du jury","Unable to retrieve this member of jury", null);
    }
}