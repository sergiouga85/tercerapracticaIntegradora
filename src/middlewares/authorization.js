import { isUser, isAdmin, isPremium } from '../controllers/authorization.controllers.js';

export const usersOnly = isUser;
export const adminsOnly = isAdmin;
export const premiumOnly= isPremium;