import { Router } from 'express';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import { inviteUserController,
   registerUserController,
   deleteUserController,
   updateUserController,
   updateUserPasswordController,
   loginUserController,
   forgotPasswordController,
   resetPasswordController,
   getAllUsersController, changeUserRoleController,
   logoutUserController,
   getCurrentUserController,
   getPendingInvitesController,
   deleteInvitationController
} from '../../controllers/auth/user.controller.js';

const authRoutes = Router();

// invite route
authRoutes.post('/invite', authenticate, requireRole([2, 3]), inviteUserController);

// get pending invites route
authRoutes.get('/pending-invites', authenticate, requireRole([2, 3]), getPendingInvitesController);

// delete pending invite route
authRoutes.delete('/pending-invites/:id', authenticate, requireRole([2, 3]), deleteInvitationController);

// register route
authRoutes.post('/register', registerUserController);

// delete user route
authRoutes.delete('/:id', authenticate, requireRole([3]), deleteUserController);

// get current user route
authRoutes.get('/me', authenticate, getCurrentUserController);

// login route
authRoutes.post('/login', loginUserController);

// logout route
authRoutes.post('/logout', authenticate, logoutUserController);

// update user route
authRoutes.put('/:id', authenticate, updateUserController);

// update user password route
authRoutes.patch('/password-update', authenticate, updateUserPasswordController);

// forgot password route
authRoutes.post('/forgot-password', forgotPasswordController);

// reset password route
authRoutes.post('/reset-password', resetPasswordController);

// get all users route
authRoutes.get('/users', authenticate, requireRole([3]), getAllUsersController);

// change user role route
authRoutes.put('/change-role/:id', authenticate, requireRole([3]), changeUserRoleController);

export default authRoutes;
