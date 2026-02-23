import { useState } from "react";
import Modal from "../ui/Modal/Modal.jsx";
import JuryForm from "./JuryForm.jsx";
import { juryService } from "../../services/jury.service.js";

export default function JuryCreateModal({ isOpen, onClose, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleCreate = async ({ firstname, lastname, job, coverFile }) => {
    setSubmitting(true);
    setApiError(null);
    try {
      const res = await juryService.create({ firstname, lastname, job, coverFile });
      const id = res?.data?.id;

      onCreated?.(id);
      onClose?.();       
      return res;
    } catch (err) {
      setApiError(err);
      throw err; 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un membre du jury" size="md">
      <JuryForm
        initialValues={{ firstname: "", lastname: "", job: "", coverUrl: null }}
        onSubmit={handleCreate}
        submitting={submitting}
        apiError={apiError}
        submitLabel="Créer"
        onCancel={onClose}
      />
    </Modal>
  );
}