import { apiCall } from '../../../../utils/api';

export const changeUserRoleService = async (userId, new_role_id) => {
   const response = await apiCall(`/api/auth/change-role/${userId}`, {
      method: 'PUT',
      body: {
         new_role_id: new_role_id
      }
   });
   return response;
};

export const deleteUserService = async (userId) => {
   const response = await apiCall(`/api/auth/${userId}`, {
      method: 'DELETE'
   });
   return response;
};