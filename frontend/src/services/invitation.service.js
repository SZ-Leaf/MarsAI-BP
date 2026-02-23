import { apiCall } from '../utils/api';

const getPendingInvitations = async () => {
   return apiCall('/api/auth/pending-invites', { method: 'GET' });
};

const cancelInvitation = async (id) => {
   return apiCall(`/api/auth/pending-invites/${id}`, { method: 'DELETE' });
};

const inviteUser = async (email, role_id) => {
   return apiCall('/api/auth/invite', { method: 'POST', body: { email, role_id } });
};

export { getPendingInvitations, cancelInvitation, inviteUser };